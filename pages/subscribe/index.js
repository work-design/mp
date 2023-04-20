Page({
  data: {

  },
  handleSubscribe(e) {
    console.log(e)
    wx.requestSubscribeMessage({
      tmplIds: ['NZK_QrLklioL-0Pcd3pvf8q1_p9EPGzd6jFE7XWWGAw'],
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  }
})
