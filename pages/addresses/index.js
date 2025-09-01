Page({
  onLoad(query) {
    wx.chooseAddress({
      success: (res) => {
        console.debug('choss', res)
        wx.request({
          url: decodeURIComponent(query.url),
          method: 'POST',
          header: {
            Authorization: wx.getStorageSync('authToken')
          },
          data: res,
          success: (response) => {
            wx.redirectTo({
              url: `/pages/index/index?path=/profiled/my/addresses/${response.data.id}/edit`
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
