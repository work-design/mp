const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('login onLoad query:', query)
    const url = decodeURIComponent(query.url)

    wx.login({
      success: res => {
        wx.request({
          url: url,
          method: 'POST',
          header: {
            Accept: 'application/json'
          },
          data: {
            code: res.code,
            appid: APPID,
            ...query
          },
          success: response => {
            wx.setStorageSync('url', response.data.url)
            wx.navigateBack({
              fail: res => {
                wx.removeStorageSync('url')
                console.debug('nav back fail', res)
              },
              success: res => {
                console.debug('nav back success', res)
              }
            })
          },
          fail: res => {
            let content = JSON.stringify(res)
            if (res.errno === 600002) {
              content = `${res.errMsg}：${url}`
            }
            wx.showModal({
              title: `登录请求失败！`,
              content: content
            })
          }
        })
      },
      fail: res => {
        wx.showModal({
          title: '登录(wx.login)失败',
          content: JSON.stringify(res)
        })
      }
    })
  }
})
