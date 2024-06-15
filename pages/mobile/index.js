const HOST = wx.getExtConfigSync().auth_host || wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({

  onload() {

  },

  getPhoneNumber(e) {
    wx.request({
      url: HOST + '/wechat/program_users/mobile',
      method: 'POST',
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      data: e,
      success: res => {
        wx.setStorageSync('authToken', res.data.auth_token)
        wx.setStorageSync('user', res.data.user)
        wx.redirectTo({
          url: `/pages/index/index?url=${encodeURIComponent(res.data.url)}`
        })
      }
    })


  }
})
