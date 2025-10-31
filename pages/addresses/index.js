Page({
  onLoad(query) {
    wx.chooseAddress({
      success: res => {
        console.debug('choss', res)
        wx.request({
          url: decodeURIComponent(query.url),
          method: 'POST',
          header: {
            Accept: 'application/json',
            Authorization: wx.getStorageSync('authToken')
          },
          data: res,
          success: response => {
            wx.redirectTo({
              url: `/pages/index/index?url=${encodeURIComponent(response.data.url)}`
            })
          },
          fail: response => {
            wx.showModal({
              title: 'post to address fail',
              content: JSON.stringify(response.detail.data)
            })
          }
        })
      },
      fail: res => {
        wx.showModal({
          title: 'chooseAddress fail',
          content: JSON.stringify(res.detail.data)
        })
      }
    })
  }

})
