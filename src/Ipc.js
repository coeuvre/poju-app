async function ipcRequest (channel, request) {
  const ipcRenderer = window.electron.ipcRenderer
  return await new Promise((resolve, reject) => {
    ipcRenderer.once(channel, (event, response, error) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
    ipcRenderer.send(channel, request)
  })
}

function initRenderer () {}

async function checkIsLogin (partition) {
  return await ipcRequest('checkIsLogin', { partition })
}

export default {
  initRenderer,
  checkIsLogin
}
