Page({
  onLoad(query) {
    wx.request({
      url: decodeURIComponent(query.url),
      header: {
        'Accept': 'application/json',
        'Authorization': wx.getStorageSync('authToken')
      },
      data: {
        appid: wx.getAccountInfoSync().miniProgram.appId
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          wx.requestPayment({
            ...res.data,
            success(res) {
              wx.redirectTo({
                url: `/pages/index/index?path=${query.path}`
              })
            },
            fail(res) {
              wx.redirectTo({
                url: `/pages/index/index?path=${query.path}`
              })
              console.debug(res)
            }
          })
        } else {
          wx.showModal({
            title: 'status code fails',
            content: JSON.stringify(res.data)
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: 'request fail',
          content: JSON.stringify(res)
        })
      }
    })
  }
})
