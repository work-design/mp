const AUTH_HOST = wx.getExtConfigSync().auth_host
const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onload() {
  },

  getPhoneNumber(e) {
    wx.request({
      url: AUTH_HOST + '/wechat/program_users/mobile',
      method: 'POST',
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      data: {
        appid: APPID,
        ...e.detail
      },
      success: res => {
        wx.navigateBack()
      }
    })
  }
})
