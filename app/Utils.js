const { net } = require('electron')

async function setCookie (ses, cookie) {
  return await new Promise((resolve, reject) => {
    ses.cookies.set(cookie, error => {
      if (error) {
        console.dir(error)
        reject(error)
      }

      resolve()
    })
  })
}

async function getCookies (ses, options) {
  return await new Promise((resolve, reject) => {
    ses.cookies.get(options, (error, cookies) => {
      if (error) {
        reject(error)
      }

      resolve(cookies)
    })
  })
}

async function doRequest (options) {
  const request = net.request(options)

  if (options.session) {
    const cookies = await getCookies(options.session, {})
    const cookie = cookies
      .filter(cookie => options.url.indexOf(cookie.domain) !== -1)
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ')
    request.setHeader('Cookie', cookie)
  }

  return await new Promise((resolve, reject) => {
    request.on('response', response => {
      let chunks = []

      response.on('data', chunk => {
        chunks.push(chunk)
      })

      response.on('end', () => resolve(Buffer.concat(chunks)))

      response.on('error', error => reject(error))
    })
    request.on('error', error => reject(error))
    request.end()
  })
}

module.exports = {
  setCookie,
  getCookies,
  doRequest
}
