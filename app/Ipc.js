const { ipcMain } = require('electron')

const JuApi = require('./JuApi')

function bind (channel, block) {
  ipcMain.on(channel, async (event, request) => {
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
  bind('checkIsLogin', async request => {
    return await JuApi.checkIsLogin(request.partition)
  })

  bind('fetchJuItemList', async request => {
    return await JuApi.queryItems(request)
  })
}

module.exports = {
  initMain
}
