const HOST = wx.getExtConfigSync().auth_host || wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('login onLoad query:', query)
    wx.login({
      success: res => {
        wx.request({
          url: HOST + '/wechat/program_users',
          method: 'POST',
          header: {
            Accept: 'application/json'
          },
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
          },
          fail: res => {
            wx.showModal({
              title: 'wx.login request fail',
              content: JSON.stringify(res)
            })
          }
        })
      },
      fail: res => {
        wx.showModal({
          title: 'wx.login fail',
          content: JSON.stringify(res)
        })
      }
    })
  }
})
