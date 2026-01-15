Page({
  onLoad(query) {
    console.debug('Share Onload:', query)
    this.setData({
      query: query
    })
  },

  openEmbedded() {
    wx.navigateToMiniProgram({
      appId: 'wxe44dc002dd0d29b0',
      path: '/pages/share/index',
      extraData: this.data.query,
      fail: (res) => {
        wx.showModal({
          title: `Open Embedded Fail fail`,
          content: JSON.stringify(res)
        })
      }
    })
  }
})
