// app.js
const AUTH_HOST = wx.getExtConfigSync().auth_host
const HOST = wx.getExtConfigSync().host

App({
  onLaunch(options) {
    console.debug('On Launch:', options)

    let appid
    if (wx.getDeviceInfo().brand === 'devtools') {
      appid = 'wx225bbbd2fe117181'
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
            const page = getCurrentPages()[0]
            console.debug('launch:', page)

            if (page) {
              page.setData({
                url: res.data.url
              })
            }
          },
          fail: res => {
            let content = JSON.stringify(res)
            if (res.errno === 600002) {
              content = AUTH_HOST
            }
            wx.showModal({
              title: `App login request fail`,
              content: content
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

    if (options.scene && page) {
      const path = decodeURIComponent(options.scene)
      if (path.startsWith('/')) {
        url = HOST + path
        page.setData({ url: url })
      }
    } else {
      page.setData({ url: HOST })
    }
  }
})
