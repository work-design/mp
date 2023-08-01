import { APPID, HOST } from '../../config'

Page({
  onLoad(query) {
    console.debug('onLoad query:', query)
    return
    wx.login({
      success: res => {
        wx.request({
          url: HOST + '/wechat/program_users',
          method: 'POST',
          data: {
            code: res.code,
            appid: APPID
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('programUser', res.data.program_user)
            wx.redirectTo({
              url: `/pages/index/index?path=${query.path}&state=${query.state}`
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
