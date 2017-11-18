const { app, ipcMain, session, BrowserWindow } = require('electron')
const moment = require('moment')
const Utils = require('./Utils')
const Ipc = require('./Ipc')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: `${__dirname}/../public/favicon.ico`
  })

  // and load the index.html of the app.
  mainWindow.loadURL(
    dev ? `http://localhost:${port}` : `file://${__dirname}/../build/index.html`
  )

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.maximize()

  mainWindow.show()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // session
  //   .fromPartition('persist:ju')
  //   .webRequest.onBeforeSendHeaders(
  //     { urls: ['https://freeway.ju.taobao.com/tg/json/queryItems*'] },
  //     (details, callback) => {
  //       console.dir(details)
  //       callback({ cancel: false, requestHeaders: details.requestHeaders })
  //     }
  //   )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('LoginSuccess', async (event, partition) => {
  const ses = session.fromPartition(partition)
  const cookies = await Utils.getCookies(ses, {})

  // Persist all session cookie
  for (let cookie of cookies) {
    if (cookie.expirationDate) {
      continue
    }

    const scheme = cookie.secure ? 'https' : 'http'
    const host = cookie.domain[0] === '.'
      ? cookie.domain.substr(1)
      : cookie.domain
    const url = scheme + '://' + host

    cookie.expirationDate = moment().add(10, 'year').unix()
    cookie.url = url
    await Utils.setCookie(ses, cookie)
  }

  // const tbToken = cookies.filter(cookie => cookie.name === '_tb_token_')[0]
  //   .value
  // const url = `https://freeway.ju.taobao.com/tg/json/queryItems.htm?_tb_token_=${tbToken}&_input_charset=UTF-8&activityEnterId=28584701&itemStatusCode=0&actionStatus=0&inputType=itemName&nameorid=&itemName=&currentPage=1&pageSize=10`
  // const body = await Utils.doRequest({
  //   session: ses,
  //   method: 'GET',
  //   url
  // })
  // console.dir(JSON.parse(iconv.decode(body, 'gbk')))
})

Ipc.initMain()
