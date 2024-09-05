// app.js
const HOST = wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

App({
  onLaunch(options) {
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
            ...options
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('user', res.data.user)
            let url
            const page = getCurrentPages()[0]

            if (options.query.scene) {
              const path = decodeURIComponent(options.query.scene)
              if (path.startsWith('/')) {
                url = HOST + path
              } else {
                url = page.data.url
              }
            } else if (page) {
              url = page.data.url
            }

            if (page && url) {
              page.setData({url: `${url}${url.includes('?') ? '&' : '?'}auth_token=${res.data.auth_token}`})
            } else {
              wx.redirectTo({
                url: `/pages/index/index?url=${encodeURIComponent(res.data.url)}`
              })
            }
          }
        })
      },
      fail: res => {
        console.debug('wx.login fail:', res)
      }
    })
  },
  onShow(options) {
    const page = getCurrentPages()[0]

    if (options.query.scene && page) {
      const path = decodeURIComponent(options.query.scene)
      if (path.startsWith('/')) {
        url = HOST + path
        page.setData({url: url})
      }
    }
  }
})
