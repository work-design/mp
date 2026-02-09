Page({
  onLoad(query) {
    console.debug('Share Onload:', query)
    const { appId, ...extra } = query
    this.setData({
      appId: appId,
      extra: extra
    })
  },

  openOther() {
    wx.navigateToMiniProgram({
      appId: this.data.appId,
      path: '/pages/share/index',
      extraData: this.data.extra,
      fail: (res) => {
        wx.showModal({
          title: `Open Embedded Fail fail`,
          content: JSON.stringify(res)
        })
      },
      success: (res) => {
        wx.navigateBack()
      }
    })
  }
})
