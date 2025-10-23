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
      success: res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          wx.requestPayment({
            ...res.data,
            success: () => {
              wx.redirectTo({
                url: `/pages/index/index?url=${query.path}`
              })
            },
            fail: (payRes) => {
              wx.showModal({
                title: '支付失败',
                content: JSON.stringify(payRes)
              })
              wx.redirectTo({
                url: `/pages/index/index?url=${query.path_fail}?err=${payRes}`
              })
            }
          })
        } else {
          wx.showModal({
            title: 'status code fails',
            content: JSON.stringify(res.data)
          })
        }
      },
      fail: res => {
        wx.showModal({
          title: 'request fail',
          content: JSON.stringify(res)
        })
      }
    })
  }
})
