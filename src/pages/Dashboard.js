import React from 'react'
import PropTypes from 'prop-types'
import { extendObservable, action, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import XLSX from 'xlsx'

import JuApi from '../JuApi'
import Utils from '../Utils'

class ExternalLink extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired
  }

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

function sheetFromArrayOfArrays (data, opts) {
  const MAX = 10000000
  const sheet = {}
  const range = { s: { c: MAX, r: MAX }, e: { c: 0, r: 0 } }
  for (let row = 0; row !== data.length; ++row) {
    for (let col = 0; col !== data[row].length; ++col) {
      if (range.s.r > row) {
        range.s.r = row
      }
      if (range.s.c > col) {
        range.s.c = col
      }
      if (range.e.r < row) {
        range.e.r = row
      }
      if (range.e.c < col) {
        range.e.c = col
      }

      const cell = { v: data[row][col], t: 's' }
      const cellRef = XLSX.utils.encode_cell({ c: col, r: row })

      sheet[cellRef] = cell
    }
  }

  if (range.s.c < MAX) {
    sheet['!ref'] = XLSX.utils.encode_range(range)
  }

  return sheet
}

async function exportItems (items) {
  const sheetName = 'Sheet 1'
  const sheet = sheetFromArrayOfArrays([
    JuApi.ItemApplyFormDetailType.map(type => type.name),
    ...items.map(item =>
      JuApi.ItemApplyFormDetailType.map(type => item[type.key])
    )
  ])
  const workbook = { SheetNames: [sheetName], Sheets: { [sheetName]: sheet } }
  await Utils.ipc('saveExcel', { workbook })
}

const JuItemList = observer(
  class JuItemList extends React.Component {
    constructor () {
      super()

      extendObservable(this, {
        activityEnterId: '',
        itemStatusCode: '0',
        actionStatus: '0',
        items: [],
        isLoading: false,

        onChangeActivityEnterId: action(event => {
          this.activityEnterId = event.target.value
        }),

        onChangeItemStatusCode: action(event => {
          this.itemStatusCode = event.target.value
        }),

        onChangeActionStatus: action(event => {
          this.actionStatus = event.target.value
        }),

        preview: action(async () => {
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
        }),

        export: action(async () => {
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

          const items = []
          for (let item of response.itemList) {
            console.log(`Fetch item ${item.juId}`)
            const itemApplyFormDetail = await JuApi.fetchItemApplyFormDetail(
              item.juId
            )
            console.log(itemApplyFormDetail)
            items.push(itemApplyFormDetail)
          }

          exportItems(items)

          runInAction(() => {
            this.isLoading = false
          })
        })
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
          <select
            value={this.actionStatus}
            onChange={this.onChangeActionStatus}
          >
            <option value='0'>全部操作状态</option>
            <option value='1'>待完善</option>
          </select>
          <button disabled={this.isLoading} onClick={this.preview}>查询</button>
          <button disabled={this.isLoading} onClick={this.export}>导出</button>
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
)

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
