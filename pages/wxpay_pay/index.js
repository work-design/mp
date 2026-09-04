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
              wx.navigateBack()
            },
            fail: (payRes) => {
              console.debug('request payment fail:', payRes)
              if (query.report_fail) {
                wx.request({
                  url: decodeURIComponent(query.report_fail),
                  method: 'POST',
                  header: {
                    'Accept': 'application/json',
                    'Authorization': wx.getStorageSync('authToken')
                  },
                  data: payRes
                })
              }
              wx.setStorageSync('url', decodeURIComponent(query.path_fail))
              wx.navigateBack({
                fail: res => {
                  wx.removeStorageSync('url')
                  console.debug('navigate back fail', res)
                },
                success: res => {
                  console.debug('navigate back success', res)
                }
              })
            }
          })
        } else {
          wx.showModal({
            title: 'status code fails',
            content: JSON.stringify(res.data)
          })
          wx.setStorageSync('url', decodeURIComponent(query.path_fail))
          wx.navigateBack({
            fail: res => {
              wx.removeStorageSync('url')
              console.debug('navigate back fail', res)
            },
            success: res => {
              console.debug('navigate back success', res)
            }
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
