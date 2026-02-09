Page({
  onLoad(query) {
    const url = decodeURIComponent(query.url)
    wx.request({
      url: url,
      header: {
        'Accept': 'application/json'
      },
      data: {
        appid: wx.getAccountInfoSync().miniProgram.appId
      },
      success: res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          wx.requestPayment({
            ...res.data,
            success: () => {
              wx.redirectTo({ url: `/pages/index/index?url=${query.path}` })
            },
            fail: (payRes) => {
              wx.request({
                url: decodeURIComponent(query.report_fail),
                method: 'POST',
                header: {
                  'Accept': 'application/json',
                  'Authorization': wx.getStorageSync('authToken')
                },
                data: payRes
              })
              wx.redirectTo({ url: `/pages/index/index?url=${query.path_fail}` })
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
        let content = JSON.stringify(res)
        if (res.errno === 600002) {
          content = url
        }

        wx.showModal({
          title: 'request fail',
          content: content
        })
      }
    })
  }
})
