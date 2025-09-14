const AUTH_HOST = wx.getExtConfigSync().auth_host

Page({
  onLoad(query) {
    console.debug('login onLoad query:', query)
    let appid
    if (wx.getDeviceInfo().brand === 'devtools') {
      appid = 'wx1ec82e7c529f99a0'
    } else {
      appid = wx.getAccountInfoSync().miniProgram.appId
    }

    wx.login({
      success: res => {
        wx.request({
          url: AUTH_HOST + '/wechat/program_users',
          method: 'POST',
          header: {
            Accept: 'application/json'
          },
          data: {
            code: res.code,
            appid: appid,
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
