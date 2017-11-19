const { session, dialog, ipcMain } = require('electron')
const iconv = require('iconv-lite')
const XLSX = require('xlsx')

const Utils = require('./Utils')

function bind (channel, block) {
  ipcMain.on(channel, async (event, request) => {
    console.log(`[main] ipc ${channel}`)
    try {
      const response = await block(request)
      event.sender.send(channel, response)
    } catch (error) {
      console.dir(error)
      event.sender.send(channel, undefined, error)
    }
  })
}

function initMain () {
  bind('getCookies', async request => {
    const ses = session.fromPartition(request.partition)
    return await Utils.getCookies(ses, request.options)
  })

  bind('fetch', async request => {
    if (request.partition) {
      request.session = session.fromPartition(request.partition)
    }

    const body = await Utils.doRequest(request)
    const encoding = request.bodyEncoding || 'utf8'
    return iconv.decode(body, encoding)
  })

  bind('saveExcel', async request => {
    return await new Promise((resolve, reject) => {
      dialog.showSaveDialog({ defaultPath: 'test.xlsx' }, filename => {
        XLSX.writeFile(request.workbook, filename)
      })
    })
  })
}

module.exports = {
  initMain
}
