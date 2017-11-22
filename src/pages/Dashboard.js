import React from 'react'
import { observable, action, computed, runInAction } from 'mobx'
import { observer } from 'mobx-react'

import JuApi from '../JuApi'
import Utils from '../Utils'

class ExternalLink extends React.Component {
  open = () => {
    const { href } = this.props

    window.electron.shell.openExternal(href)
  }

  render () {
    return (
      <a onClick={this.open} style={{ cursor: 'pointer' }}>
        {this.props.children}
      </a>
    )
  }
}

class FetchListTask {
  @observable isStarted = false
  @observable isFinished = false
  @observable isAbortRequested = false
  @observable isAbort = false
  @observable total = 0
  @observable progress = 0
  @observable items = []
  @computed get isLoading () {
    return this.isStarted && !this.isFinished
  }

  /**
   * @param list []
   * @param fetchItem (e) => Item
   */
  @action start = async (list, fetchItem) => {
    if (this.isLoading) {
      throw Error('Already started')
    }

    this.isStarted = true
    this.isFinished = false
    this.isAbortRequested = false
    this.isAbort = false
    this.total = list.length
    this.progress = 0
    this.items = []

    for (let item of list) {
      if (this.isAbortRequested) {
        break
      }
      const result = await fetchItem(item)
      runInAction(() => {
        this.items.push(result)
        this.progress = this.progress + 1
      })
    }

    runInAction(() => {
      this.isAbort = this.isAbortRequested
      this.isFinished = true
    })

    return this.items
  }

  @action abort = () => {
    this.isAbortRequested = true
  }
}

async function exportItems (items) {
  const data = [
    JuApi.ItemApplyFormDetailType.map(type => ({
      value: type.name,
      font: {
        color: { argb: 'FFFFFFFF' }
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000000' }
      }
    })),
    ...items.map(item => {
      let data = JuApi.ItemApplyFormDetailType.map(type => ({
        value: item[type.key]
      }))

      if (item.error) {
        data = data.map(cell => ({
          ...cell,
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFC7CE' }
          }
        }))
        data.push({
          value: item.error
        })
      }

      return data
    })
  ]

  await Utils.ipc('writeExcel', { filename: 'test.xlsx', data })
}

@observer class JuItemList extends React.Component {
  @observable activityEnterId = ''
  @observable itemStatusCode = '0'
  @observable actionStatus = '0'
  @observable items = []
  @observable fetchPageTask = new FetchListTask()
  @observable fetchListTask = new FetchListTask()
  @observable isLoading = false

  @action onChangeActivityEnterId = event => {
    this.activityEnterId = event.target.value
  }

  @action onChangeItemStatusCode = event => {
    this.itemStatusCode = event.target.value
  }

  @action onChangeActionStatus = event => {
    this.actionStatus = event.target.value
  }

  @action preview = async () => {
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    const response = await JuApi.fetchJuItemList({
      activityEnterId: this.activityEnterId,
      itemStatusCode: this.itemStatusCode,
      actionStatus: this.actionStatus,
      currentPage: 1,
      pageSize: 10
    })
    console.log(response)

    runInAction(() => {
      this.isLoading = false

      if (response.success) {
        this.items = response.itemList
      }
    })
  }

  @action export = async () => {
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    const response = await JuApi.fetchJuItemList({
      activityEnterId: this.activityEnterId,
      itemStatusCode: this.itemStatusCode,
      actionStatus: this.actionStatus,
      currentPage: 1,
      pageSize: 1
    })

    const pageSize = 20
    const totalPage = Math.ceil(response.totalItem / pageSize)
    const list = []
    for (let currentPage = 1; currentPage <= totalPage; ++currentPage) {
      list.push({
        currentPage,
        pageSize
      })
    }

    const pages = await this.fetchPageTask.start(list, async item => {
      return await JuApi.fetchJuItemList({
        activityEnterId: this.activityEnterId,
        itemStatusCode: this.itemStatusCode,
        actionStatus: this.actionStatus,
        currentPage: item.currentPage,
        pageSize: item.pageSize
      })
    })

    let items = []

    for (let page of pages) {
      items = [...items, ...page.itemList]
    }

    const itemApplyFormDetails = await this.fetchListTask.start(
      items,
      async item => {
        try {
          return await JuApi.fetchItemApplyFormDetail(item.juId)
        } catch (error) {
          const result = {
            juId: item.juId.toString(),
            itemId: item.itemId.toString(),
            shortTitle: item.itemName,
            error: error.message
          }
          console.log(result)
          return result
        }
      }
    )

    exportItems(itemApplyFormDetails)

    runInAction(() => {
      this.isLoading = false
    })
  }

  render () {
    return (
      <div>
        <p>聚划算商品列表</p>
        <label>
          activityEnterId:
          <input
            value={this.activityEnterId}
            onChange={this.onChangeActivityEnterId}
          />
        </label>
        <select
          value={this.itemStatusCode}
          onChange={this.onChangeItemStatusCode}
        >
          <option value='0'>全部商品状态</option>
          <option value='1'>待审核</option>
          <option value='2'>审核中</option>
          <option value='3'>审核不通过</option>
          <option value='4'>审核通过</option>
          <option value='6'>待发布</option>
          <option value='7'>已发布</option>
          <option value='8'>活动中</option>
          <option value='9'>活动结束</option>
          <option value='10'>取消活动</option>
          <option value='12'>售罄</option>
        </select>
        <select value={this.actionStatus} onChange={this.onChangeActionStatus}>
          <option value='0'>全部操作状态</option>
          <option value='1'>待完善</option>
        </select>
        <button disabled={this.isLoading} onClick={this.preview}>查询</button>
        <button disabled={this.isLoading} onClick={this.export}>
          导出
        </button>
        {this.fetchPageTask.isStarted &&
          <div>
            <p>
              读取列表页：
              {this.fetchPageTask.progress}
              /
              {this.fetchPageTask.total}
              {this.fetchPageTask.isLoading &&
                <button
                  disabled={this.fetchPageTask.isAbortRequested}
                  onClick={() => this.fetchPageTask.abort()}
                >
                  停止
                </button>}
            </p>
            <p>
              读取商品详情：
              {this.fetchListTask.progress}
              /
              {this.fetchListTask.total}
              {this.fetchListTask.isLoading &&
                <button
                  disabled={this.fetchListTask.isAbortRequested}
                  onClick={() => this.fetchListTask.abort()}
                >
                  停止
                </button>}
            </p>
          </div>}
        {this.isLoading && <p>Loading</p>}
        {this.items.length === 0 && <p>Empty</p>}
        {this.items.map(item => (
          <div key={item.juId}>
            <img alt={item.itemName} src={item.itemPicUrl} />
            <span>商品 ID：{item.itemId}</span>
            <span>商品名称：{item.itemName}</span>
            <span>商品状态：{item.itemStatus.statusMsg}</span>
            {item.viewList.map(view => (
              <ExternalLink
                key={view.id}
                href={`https://freeway.ju.taobao.com${view.url}`}
              >
                {view.name}
              </ExternalLink>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

const Page = observer(
  class Page extends React.Component {
    render () {
      return (
        <div>
          <p>Dashboard</p>
          <JuItemList />
        </div>
      )
    }
  }
)

export default Page
