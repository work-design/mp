const HOST = wx.getExtConfigSync().auth_host || wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('login/index onLoad query:', query)
    wx.login({
      success: res => {
        wx.request({
          url: HOST + '/wechat/program_users',
          method: 'POST',
          data: {
            code: res.code,
            appid: APPID,
            ...query
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('user', res.data.user)
            wx.redirectTo({
              url: `/pages/index/index?url=${encodeURIComponent(res.data.url)}`
            })
          }
        })
      },
      fail: res => {
        console.debug('wx.login fail:', res)
      }
    })
  }
})
