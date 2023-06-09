Page({
  onLoad(query) {
    wx.chooseAddress({
      success: (res) => {
        wx.request({
          url: query.url + '.json',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': wx.getStorageSync('authToken')
          },
          data: res,
          success(response) {
            wx.navigateBack({
              delta: 1,
              success(res) {
                wx.reLaunch({
                  url: `/pages/index/index?path=/profiled/my/addresses/${response.data.id}/edit`
                })
              }
            })
          },
          fail(res) {
            console.log(res)
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  }

})
