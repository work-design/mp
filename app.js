// app.js
const AUTH_HOST = wx.getExtConfigSync().auth_host
const WEBVIEW_HOST = wx.getExtConfigSync().webview_host
const APPID = wx.getAccountInfoSync().miniProgram.appId

App({
  onLaunch(options) {
    console.debug('On Launch:', options)
    const page = getCurrentPages()[0]
    wx.showModal({
      title: 'App On Launch',
      content: JSON.stringify(page)
    })

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
            appid: APPID,
            ...options
          },
          success: res => {
            if (page && res.data.url) {
              page.setData({
                url: res.data.url
              })
            } else {
              wx.showModal({
                title: `App login Success page`,
                content: JSON.stringify(page)
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
        page.setData({ 
          url: WEBVIEW_HOST + path 
        })
      } else {
        page.setData({
          url: WEBVIEW_HOST
        })
      }
      wx.showModal({
        title: `App On show page in scene`,
        content: JSON.stringify(page.data)
      })
    } else if (page) {
      page.setData({
        url: WEBVIEW_HOST
      })
      wx.showModal({
        title: `App On show page in setdata`,
        content: JSON.stringify(page)
      })
    }
    wx.showModal({
      title: `App On show page`,
      content: JSON.stringify(page)
    })
  }
})
