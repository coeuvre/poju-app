const { session } = require('electron')
const iconv = require('iconv-lite')

const Utils = require('./Utils')

async function queryItems (
  partition,
  activityEnterId,
  itemStatusCode = 0,
  actionStatus = 0,
  currentPage = 1,
  pageSize = 10
) {
  const ses = session.fromPartition(partition)
  const cookies = await Utils.getCookies(ses, {})
  const tbToken = cookies.filter(cookie => cookie.name === '_tb_token_')[0]
    .value
  const url = `https://freeway.ju.taobao.com/tg/json/queryItems.htm?_tb_token_=${tbToken}&_input_charset=UTF-8&activityEnterId=${activityEnterId}&itemStatusCode=${itemStatusCode}&actionStatus=${actionStatus}&currentPage=${currentPage}&pageSize=${pageSize}`
  const body = await Utils.doRequest({
    session: ses,
    method: 'GET',
    url
  })

  return JSON.parse(iconv.decode(body, 'gbk'))
}

async function checkIsLogin (partition) {
  const response = await queryItems(partition, 1, 0, 0, 1, 0)
  return response.success
}

module.exports = {
  queryItems,
  checkIsLogin
}
