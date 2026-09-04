Page({
  onLoad(query) {
    console.debug('address index', query)
    wx.chooseAddress({
      success: res => {
        console.debug('choss', res)
        wx.request({
          url: decodeURIComponent(query.url),
          method: 'POST',
          header: {
            Accept: 'application/json'
          },
          data: res,
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
          fail: response => {
            console.log(response)
            wx.showModal({
              title: 'post to address fail',
              content: JSON.stringify(response.errMsg)
            })
          }
        })
      },
      fail: res => {
        console.log(res)
        wx.showModal({
          title: 'chooseAddress fail',
          content: JSON.stringify(res.errMsg)
        })
      }
    })
  }

})
