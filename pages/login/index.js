const AUTH_HOST = 'https://zl.one.work'
const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('login onLoad query:', query)

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
            appid: APPID,
            ...query
          },
          success: res => {
            wx.redirectTo({
              url: `/pages/index/index?url=${encodeURIComponent(res.data.url)}`
            })
          },
          fail: res => {
            let content = JSON.stringify(res)
            if (res.errno === 600002) {
              content = AUTH_HOST
            }
            wx.showModal({
              title: `Login page login request fail`,
              content: content
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
