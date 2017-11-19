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
    name: 'itemId',
    get: form => form.querySelector('input[name="itemId"]').value
  },
  {
    key: 'platformId',
    name: 'platformId',
    get: form => form.querySelector('input[name="platformId"]').value
  },
  {
    key: 'activityEnterId',
    name: 'activityEnterId',
    get: form => form.querySelector('input[name="activityEnterId"]').value
  },
  {
    key: 'skuType',
    name: 'skuType',
    get: form => form.querySelector('input[name="skuType"]:checked').value
  },
  {
    key: 'activityPrice',
    name: 'activityPrice',
    get: form => form.querySelector('input[name="activityPrice"]').value
  },
  {
    key: 'priceType',
    name: 'priceType',
    get: form => form.querySelector('input[name="priceType"]:checked').value
  },
  {
    key: 'inventoryType',
    name: 'inventoryType',
    get: form =>
      form.querySelector('input[name="inventoryType"]:checked').value
  },
  {
    key: 'itemCount',
    name: 'itemCount',
    get: form => form.querySelector('input[name="itemCount"]').value
  },
  {
    key: 'currentCount',
    name: 'currentCount',
    get: form =>
      form
        .querySelector('#itemCount')
        .nextElementSibling.querySelector('.c-primary').innerHTML
  },
  {
    key: 'shortTitle',
    name: 'shortTitle',
    get: form => form.querySelector('input[name="shortTitle"]').value
  },
  {
    key: 'smallTitle',
    name: 'smallTitle',
    get: form => form.querySelector('input[name="smallTitle"]').value
  },
  {
    key: 'itemMainPic',
    name: 'itemMainPic',
    get: form => form.querySelector('input[name="itemMainPic"]').value
  },
  {
    key: 'itemExtraPic1',
    name: 'itemExtraPic1',
    get: form => form.querySelector('input[name="itemExtraPic1"]').value
  },
  {
    key: 'itemExtraPic2',
    name: 'itemExtraPic2',
    get: form => form.querySelector('input[name="itemExtraPic2"]').value
  },
  {
    key: 'itemExtraPic3',
    name: 'itemExtraPic3',
    get: form => form.querySelector('input[name="itemExtraPic3"]').value
  },
  {
    key: 'itemExtraPic4',
    name: 'itemExtraPic4',
    get: form => form.querySelector('input[name="itemExtraPic4"]').value
  },
  {
    key: 'itemWireMainPic',
    name: 'itemWireMainPic',
    get: form => form.querySelector('input[name="itemWireMainPic"]').value
  },
  {
    key: 'itemTaobaoAppMaterial',
    name: 'itemTaobaoAppMaterial',
    get: form =>
      form.querySelector('input[name="itemTaobaoAppMaterial"]').value
  },
  {
    key: 'feature1',
    name: 'feature1',
    get: form => form.querySelector('input[name="feature1"]').value
  },
  {
    key: 'featureDesc1',
    name: 'featureDesc1',
    get: form => form.querySelector('input[name="featureDesc1"]').value
  },
  {
    key: 'featureDesc1',
    name: 'featureDesc1',
    get: form => form.querySelector('input[name="featureDesc1"]').value
  },
  {
    key: 'feature2',
    name: 'feature2',
    get: form => form.querySelector('input[name="feature2"]').value
  },
  {
    key: 'featureDesc2',
    name: 'featureDesc2',
    get: form => form.querySelector('input[name="featureDesc2"]').value
  },
  {
    key: 'feature3',
    name: 'feature3',
    get: form => form.querySelector('input[name="feature3"]').value
  },
  {
    key: 'featureDesc3',
    name: 'featureDesc3',
    get: form => form.querySelector('input[name="featureDesc3"]').value
  },
  {
    key: 'sellPoint',
    name: 'sellPoint',
    get: form => form.querySelector('input[name="sellPoint"]').value
  },
  {
    key: 'isImport',
    name: 'isImport',
    get: form => form.querySelector('input[name="isImport"]').value
  },
  {
    key: 'payPostage',
    name: 'payPostage',
    get: form => form.querySelector('input[name="payPostage"]').value
  },
  {
    key: 'limitNum',
    name: 'limitNum',
    get: form => form.querySelector('input[name="limitNum"]').value
  },
  {
    key: 'itemDesc',
    name: 'itemDesc',
    get: form => form.querySelector('textarea[name="itemDesc"]').innerHTML
  },
  {
    key: 'itemBrandName',
    name: 'itemBrandName',
    get: form => form.querySelector('input[name="itemBrandName"]').value
  },
  {
    key: 'DC_SPMD',
    name: 'DC_SPMD',
    get: form => getValue(form.querySelector('input[name="DC_SPMD"]'))
  },
  {
    key: 'DC_TJLY',
    name: 'DC_TJLY',
    get: form => getValue(form.querySelector('input[name="DC_TJLY"]'))
  },
  {
    key: 'bimaiReason',
    name: 'bimaiReason',
    get: form => getValue(form.querySelector('input[name="bimaiReason"]'))
  },
  {
    key: 'TOP_SELL_POINTS',
    name: 'TOP_SELL_POINTS',
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
