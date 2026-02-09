Page({
  onLoad(query) {
    console.debug('Share Onload:', query)
    const { appId, ...extra } = query
    const extraArray = Object.entries(extra)
    this.setData({
      appId: appId,
      extra: extra,
      extraArray: extraArray,
      title: '进入门店小程序并分享'
    })
  },

  openOther() {
    wx.navigateToMiniProgram({
      appId: this.data.appId,
      envVersion: 'trial',
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
