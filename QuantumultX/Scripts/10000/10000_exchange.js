const wap189Name = '中国电信'
const headersKey = 'wap189_exchange_headers'
const bodyKey    = 'wap189_exchange_body'
const wap189 = init()
const headersVal = wap189.getdata(headersKey)
const bodyVal    = wap189.getdata(bodyKey)

exchange()

function exchange() {
  let url = { url: `https://wapside.189.cn:9001/api/exchange/consume`, headers: JSON.parse(headersVal) }
  url.body = JSON.stringify(JSON.parse(bodyVal))
  wap189.log(url.body)
  wap189.post(url, (error, response, data) => {
    wap189.log(`${wap189Name}, data: ${data}`)
    let result = JSON.parse(data)
    const title = `${wap189Name}`
    let subTitle = ``
    let detail = ``
    if (result.resoultCode == 0) {
      subTitle = `成功`
      detail = `${result.resoultMsg}  `
    } else  {
      subTitle = `失败`
      detail = `说明: ${result.resoultMsg}`
    }
    wap189.msg(title, subTitle, detail)
  })
  wap189.done()
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
