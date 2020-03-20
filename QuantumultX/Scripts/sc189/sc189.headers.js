const sc189Name = '四川电信'
const headersKey = 'sc189_headers'
const bodyKey = 'sc189_body'

const sc189 = init()
let headersVal = null
let bodyVal = ``

if ($request.body) {
  headersVal = JSON.stringify($request.headers)
  bodyVal = bodyVal ? bodyVal : $request.body
}
if (headersVal) {
  sc189.setdata(headersVal, headersKey)
  sc189.msg(`${sc189Name}`, '获取Headers: 成功', '')
  sc189.log(`[${sc189Name}] 获取Headers: 成功, Headers: ${headersVal}`)
} else {
  sc189.msg(`${sc189Name}`, '获取Headers: 失败', '说明: 未知')
  sc189.log(`[${sc189Name}] 获取Headers: 失败, Headers: ${headersVal}`)
}
if (bodyVal) {
  sc189.setdata(bodyVal, bodyKey)
  sc189.msg(`${sc189Name}`, '获取Body: 成功', '')
  sc189.log(`[${sc189Name}] 获取Body: 成功, body: ${bodyVal}`)
} else {
  if (isQuanX()) {
    sc189.msg(`${sc189Name}`, '获取Body: 失败', '说明: QuanX用户请手动抓包 body 参数!')
    sc189.log(`[${sc189Name}] 获取Body: 失败, 说明: QuanX用户请手动抓包 body 参数!`)
  } else {
    sc189.msg(`${sc189Name}`, '获取Body: 失败', '说明: 未知')
    sc189.log(`[${sc189Name}] 获取Body: 失败, body: ${bodyVal}`)
  }
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
sc189.done()
