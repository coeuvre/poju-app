const partition = 'persist:ju'

async function ipc (channel, request) {
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

async function checkIsLogin () {
  return await ipc('checkIsLogin', { partition })
}

async function fetchJuItemList (request) {
  return await ipc('fetchJuItemList', { partition, ...request })
}

export default {
  partition,
  checkIsLogin,
  fetchJuItemList
}
