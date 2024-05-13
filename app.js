// app.js
const HOST = wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

App({
  onLaunch(options) {
    const x = wx.getExtConfigSync()
    console.debug('ext Config:', x)

    wx.request({
      url: HOST + '/wechat/launch',
      method: 'POST',
      data: {
        appid: APPID,
        ...options
      },
      success: res => {}
    })
  }
})
