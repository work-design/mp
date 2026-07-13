Page({
  data: {
    title: '进入门店小程序并分享'
  },

  onLoad(query) {
    console.debug('Share Onload:', query)
    const { appId, ...extra } = query

    if (extra.title) {
      this.setData({ title: decodeURIComponent(extra.title) })
    }
    if (extra.debug) {
      this.setData({ debug: extra.debug !== 'false' })
    }

    let extraArray = []
    Object.entries(extra).forEach(([key, value]) => {
      extraArray.push({
        key: key, 
        value: decodeURIComponent(value)
      })
    })
    this.setData({
      appId: appId,
      extra: extra,
      extraArray: extraArray
    })
  },

  openOther() {
    wx.navigateToMiniProgram({
      path: '/pages/share/index',
      appId: this.data.appId,
      extraData: this.data.extra,
      fail: res => {
        let content = ''
        if (this.data.debug) {
          content = JSON.stringify(res)
        }

        wx.showModal({
          title: '取消分享转发',
          content: content
        })
        wx.navigateBack()
      },
      success: () => {
        wx.navigateBack()
      }
    })
  }
})
