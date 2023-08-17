Page({
  onLoad(query) {
    console.debug('login/index onLoad query:', query)
    wx.login({
      success: res => {
        wx.request({
          url: wx.getExtConfigSync().host + '/wechat/program_users',
          method: 'POST',
          data: {
            code: res.code,
            state: query.state,
            appid: wx.getAccountInfoSync().miniProgram.appId
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
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
