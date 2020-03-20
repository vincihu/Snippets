const sc189Name = '四川电信'
const headersKey = 'sc189_headers'
const bodyKey    = 'sc189_body'
const cloudSessionIDKey = 'sc189_cloudSessionID'
const sc189 = init()
const headersVal = sc189.getdata(headersKey)
const bodyVal    = sc189.getdata(bodyKey)
let   cloudSessionIDVal = ``
main()

async function main() {
//  await prepare();
//  await toSignIn();
  doUserLogin()
  setTimeout(toSignIn, 5000);
//  toSignIn()
}

//function prepare(){
//  return new Promise(resolve => {
//    doUserLogin()
//    resolve('done')
//  })
//}


function doUserLogin() {
  let url = { url: `https://wapsc.189.cn/lls-user-center/user/doUserLogin`, headers: JSON.parse(headersVal) }
  url.body = bodyVal
  sc189.log(url.headers)
  sc189.log(url.body)
  sc189.post(url, (error, response, data) => {
    sc189.log(`${sc189Name}, data: ${data}`)
    let result = JSON.parse(data)
    const title = `${sc189Name}`
    let subTitle = ``
    let detail = ``
    if (result.head.respCode == 0) {
      subTitle = `登陆成功`
      detail = `${result.head.respMsg} ${result.body.cloudSessionID}`
      cloudSessionIDVal = result.body.cloudSessionID
      sc189.setdata(cloudSessionIDVal, cloudSessionIDKey)
    } else  {
      subTitle = `登录失败`
      detail = `说明: ${result.head.respMsg}`
    }
    sc189.msg(title, subTitle, detail)
  })
  sc189.done()
}

function toSignIn() {
  let url = { url: `https://wapsc.189.cn/lls-gold-center/signIn/toSignIn`, headers: JSON.parse(headersVal) }
  cloudSessionIDVal = sc189.getdata( cloudSessionIDKey)
  url.body = JSON.stringify({head:{ cloudSessionID: cloudSessionIDVal },body:""})
  sc189.log(url.body)
  sc189.post(url, (error, response, data) => {
    sc189.log(`${sc189Name}, data: ${data}`)
    let result = JSON.parse(data)
    const title = `${sc189Name}`
    let subTitle = ``
    let detail = ``
    if (result.head.respCode == 0) {
      subTitle = `签到结果: 成功`
      detail = `${result.body.signResult[0].typeInfo} ${result.body.signResult[0].amount} ,${result.body.signResult[1].typeInfo} ${result.body.signResult[1].amount} `
    } else  {
      subTitle = `签到结果: 失败`
      detail = `说明: ${result.head.respMsg}`
    }
    sc189.msg(title, subTitle, detail)
  })
  sc189.done()
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
