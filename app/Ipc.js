const { session, dialog, ipcMain } = require('electron')
const iconv = require('iconv-lite')
const Excel = require('exceljs')

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

  bind('writeExcel', async request => {
    return await new Promise((resolve, reject) => {
      const workbook = new Excel.Workbook()
      const sheet = workbook.addWorksheet('Sheet 1')

      for (let [rowIndex, row] of request.data.entries()) {
        for (let [colIndex, col] of row.entries()) {
          const cell = sheet.getRow(rowIndex + 1).getCell(colIndex + 1)
          for (let key in col) {
            cell[key] = col[key]
          }
        }
      }

      dialog.showSaveDialog({ defaultPath: request.filename }, filename => {
        workbook.xlsx.writeFile(filename)
      })
    })
  })
}

module.exports = {
  initMain
}
