// app.js
const AUTH_HOST = wx.getExtConfigSync().auth_host

App({
  onLaunch(options) {
    let appid
    if (wx.getSystemInfoSync().brand === 'devtools') {
      appid = 'wx1ec82e7c529f99a0'
    } else {
      appid = wx.getAccountInfoSync().miniProgram.appId
    }

    wx.login({
      success: res => {
        console.debug('login:', res)
        wx.request({
          url: AUTH_HOST + '/wechat/program_users',
          method: 'POST',
          header: {
            Accept: 'application/json'
          },
          data: {
            code: res.code,
            appid: appid,
            ...options
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('user', res.data.user)
            let url
            const page = getCurrentPages()[0]
            console.debug('launch:', page)

            if (options.query.scene && page) {
              const path = decodeURIComponent(options.query.scene)
              if (path.startsWith('/')) {
                url = HOST + path
                page.setData({
                  url: `${url}${url.includes('?') ? '&' : '?'}auth_token=${res.data.auth_token}`
                })
              }
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
