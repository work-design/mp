import { HOST } from '../../config'

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
            state: query.state,
            appid: wx.getAccountInfoSync().miniProgram.appId
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('programUser', res.data.program_user)
            wx.redirectTo({
              url: `/pages/index/index?url=${res.data.url}`
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
