import React from 'react'
import { extendObservable, action, runInAction } from 'mobx'
import { observer } from 'mobx-react'

import JuApi from '../JuApi'

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
              value={this.observable}
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
          <button onClick={this.preview}>查询</button>
          {this.isLoading && <p>Loading</p>}
          {this.items.length === 0 && <p>Empty</p>}
          {this.items.map(item => (
            <div key={item.juId}>
              <img alt={item.itemName} src={item.itemPicUrl} />
              <span>商品 ID：{item.itemId}</span>
              <span>商品名称：{item.itemName}</span>
              <span>商品状态：{item.itemStatus.statusMsg}</span>
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
