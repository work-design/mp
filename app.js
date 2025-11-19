// app.js
const AUTH_HOST = wx.getExtConfigSync().auth_host

App({
  onLaunch(options) {
    console.debug('On Launch:', options)

    let appid
    if (wx.getDeviceInfo().brand === 'devtools') {
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
          },
          fail: res => {
            wx.showModal({
              title: `App login request fail: ${AUTH_HOST}`,
              content: JSON.stringify(res)
            })
          }
        })
      },
      fail: res => {
        console.debug('wx.login fail:', res)
      }
    })
  },

  onShow(options) {
    console.debug('On Show:', options)
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
