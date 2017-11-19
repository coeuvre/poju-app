import qs from 'qs'

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

function parseQueryString (search) {
  return qs.parse(search, { ignoreQueryPrefix: true })
}

function stringifyQueryString (object) {
  return qs.stringify(object, { addQueryPrefix: true })
}

export default {
  ipc,
  parseQueryString,
  stringifyQueryString
}
