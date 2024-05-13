// app.js
const HOST = wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

App({
  onLaunch(options) {
    console.debug('------------1', getCurrentPages())
    wx.login({
      success: res => {
        wx.request({
          url: HOST + '/wechat/program_users',
          method: 'POST',
          data: {
            code: res.code,
            appid: APPID,
            ...options
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('user', res.data.user)
            const page = getCurrentPages()[0]
            console.debug('------------2', )
            page.setData({ url: `${page.data.url}?auth_token=${res.data.auth_token}` })
          }
        })
      },
      fail: res => {
        console.debug('wx.login fail:', res)
      }
    })
  }
})
