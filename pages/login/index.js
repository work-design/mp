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
          success: res => {
            wx.redirectTo({
              url: `/pages/index/index?url=${encodeURIComponent(res.data.url)}`
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
