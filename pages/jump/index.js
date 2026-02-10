Page({
  data: {
    title: '进入门店小程序并分享'
  },

  onLoad(query) {
    console.debug('Share Onload:', query)
    const { appId, title, debug, ...extra } = query

    if (title) {
      this.setData({ title: decodeURIComponent(title) })
    }
    if (debug) {
      this.setData({ debug: debug })
    }

    const extraArray = Object.entries(extra)
    this.setData({
      appId: appId,
      extra: extra,
      extraArray: extraArray
    })
  },

  openOther() {
    wx.navigateToMiniProgram({
      appId: this.data.appId,
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
