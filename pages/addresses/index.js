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
          success: (response) => {
            wx.redirectTo({
              url: `/pages/index/index?url=${encodeURIComponent(response.data.url)}`
            })
          },
          fail: (res) => {
            console.debug(res)
          }
        })
      },
      fail: (res) => {
        console.debug(res)
      }
    })
  }

})
