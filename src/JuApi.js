import Utils from './Utils'

const partition = 'persist:ju'

async function fetch (request) {
  return await Utils.ipc('fetch', request)
}

async function getCookies (partition, options) {
  return await Utils.ipc('getCookies', { partition, options })
}

async function fetchJuItemList (request) {
  const {
    activityEnterId,
    itemStatusCode,
    actionStatus,
    currentPage,
    pageSize
  } = request
  const cookies = await getCookies(partition, {})
  const tbToken = cookies.filter(cookie => cookie.name === '_tb_token_')[0]
    .value
  const url = `https://freeway.ju.taobao.com/tg/json/queryItems.htm?_tb_token_=${tbToken}&_input_charset=UTF-8&activityEnterId=${activityEnterId}&itemStatusCode=${itemStatusCode}&actionStatus=${actionStatus}&currentPage=${currentPage}&pageSize=${pageSize}`
  const body = await fetch({
    partition,
    method: 'GET',
    url,
    bodyEncoding: 'GBK'
  })

  return JSON.parse(body)
}

function getValue (e) {
  if (e) {
    return e.value
  } else {
    return ''
  }
}

const ItemApplyFormDetailType = [
  {
    key: 'juId',
    name: 'juId',
    get: form => form.querySelector('input[name="juId"]').value
  },
  {
    key: 'itemId',
    name: '商品ID',
    get: form => form.querySelector('input[name="itemId"]').value
  },
  {
    key: 'platformId',
    name: '平台ID',
    get: form => form.querySelector('input[name="platformId"]').value
  },
  {
    key: 'activityEnterId',
    name: '活动ID',
    get: form => form.querySelector('input[name="activityEnterId"]').value
  },
  {
    key: 'skuType',
    name: '报名方式',
    get: form => form.querySelector('input[name="skuType"]:checked').value
  },
  {
    key: 'activityPrice',
    name: '活动价格',
    get: form => form.querySelector('input[name="activityPrice"]').value
  },
  {
    key: 'priceType',
    name: '价格方式',
    get: form => form.querySelector('input[name="priceType"]:checked').value
  },
  {
    key: 'inventoryType',
    name: '库存类型',
    get: form =>
      form.querySelector('input[name="inventoryType"]:checked').value
  },
  {
    key: 'itemCount',
    name: '报名数量',
    get: form => form.querySelector('input[name="itemCount"]').value
  },
  {
    key: 'currentCount',
    name: '当前库存量',
    get: form =>
      form
        .querySelector('#itemCount')
        .nextElementSibling.querySelector('.c-primary').innerHTML
  },
  {
    key: 'shortTitle',
    name: '宝贝标题',
    get: form => form.querySelector('input[name="shortTitle"]').value
  },
  {
    key: 'smallTitle',
    name: '短标题',
    get: form => form.querySelector('input[name="smallTitle"]').value
  },
  {
    key: 'itemMainPic',
    name: '主图',
    get: form => form.querySelector('input[name="itemMainPic"]').value
  },
  {
    key: 'itemExtraPic1',
    name: '辅图1',
    get: form => form.querySelector('input[name="itemExtraPic1"]').value
  },
  {
    key: 'itemExtraPic2',
    name: '辅图2',
    get: form => form.querySelector('input[name="itemExtraPic2"]').value
  },
  {
    key: 'itemExtraPic3',
    name: '辅图3',
    get: form => form.querySelector('input[name="itemExtraPic3"]').value
  },
  {
    key: 'itemExtraPic4',
    name: '辅图4',
    get: form => form.querySelector('input[name="itemExtraPic4"]').value
  },
  {
    key: 'itemWireMainPic',
    name: '无线主图',
    get: form => form.querySelector('input[name="itemWireMainPic"]').value
  },
  {
    key: 'itemTaobaoAppMaterial',
    name: '商品素材图',
    get: form =>
      form.querySelector('input[name="itemTaobaoAppMaterial"]').value
  },
  {
    key: 'feature1',
    name: '卖点1',
    get: form => form.querySelector('input[name="feature1"]').value
  },
  {
    key: 'featureDesc1',
    name: '描述1',
    get: form => form.querySelector('input[name="featureDesc1"]').value
  },
  {
    key: 'feature2',
    name: '卖点2',
    get: form => form.querySelector('input[name="feature2"]').value
  },
  {
    key: 'featureDesc2',
    name: '描述2',
    get: form => form.querySelector('input[name="featureDesc2"]').value
  },
  {
    key: 'feature3',
    name: '卖点3',
    get: form => form.querySelector('input[name="feature3"]').value
  },
  {
    key: 'featureDesc3',
    name: '描述3',
    get: form => form.querySelector('input[name="featureDesc3"]').value
  },
  {
    key: 'sellPoint',
    name: '价格卖点',
    get: form => form.querySelector('input[name="sellPoint"]').value
  },
  {
    key: 'isImport',
    name: '是否进口商品',
    get: form => form.querySelector('input[name="isImport"]').value
  },
  {
    key: 'payPostage',
    name: '运费',
    get: form => form.querySelector('input[name="payPostage"]').value
  },
  {
    key: 'limitNum',
    name: '每个ID限购',
    get: form => form.querySelector('input[name="limitNum"]').value
  },
  {
    key: 'itemDesc',
    name: '宝贝描述',
    get: form => form.querySelector('textarea[name="itemDesc"]').innerHTML
  },
  {
    key: 'itemBrandName',
    name: '品牌名称',
    get: form => form.querySelector('input[name="itemBrandName"]').value
  },
  {
    key: 'itemBrandLogo',
    name: '品牌Logo',
    get: form => form.querySelector('input[name="itemBrandLogo"]').value
  },
  {
    key: 'DC_SPMD',
    name: '大促卖点',
    get: form => getValue(form.querySelector('input[name="DC_SPMD"]'))
  },
  {
    key: 'DC_TJLY',
    name: '大促推荐理由',
    get: form => getValue(form.querySelector('input[name="DC_TJLY"]'))
  },
  {
    key: 'bimaiReason',
    name: '必买理由',
    get: form => getValue(form.querySelector('input[name="bimaiReason"]'))
  },
  {
    key: 'TOP_SELL_POINTS',
    name: '尖货卖点',
    get: form => form.querySelector('input[name="TOP_SELL_POINTS"]').value
  }
]

async function fetchItemApplyFormDetail (juId) {
  const url = `https://freeway.ju.taobao.com/tg/itemApplyFormDetail.htm?juId=${juId}`
  const body = await fetch({
    partition,
    method: 'GET',
    url,
    bodyEncoding: 'GBK'
  })
  const parser = new DOMParser()
  const doc = parser.parseFromString(body, 'text/html')
  const form = doc.querySelector('#J_DetailForm')

  if (!form) {
    return
  }

  const result = {}
  ItemApplyFormDetailType.forEach(type => {
    result[type.key] = type.get(form)
  })

  return result
}

export default {
  partition,
  fetchJuItemList,
  ItemApplyFormDetailType,
  fetchItemApplyFormDetail
}
