const HOST = wx.getExtConfigSync().host
const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('Share Onload:', query)
    const launchOptions = wx.getLaunchOptionsSync()
    let options = query
    if (launchOptions.scene === 1037) {
      options = launchOptions.referrerInfo.extraData
    }

    this.setData({
      url: decodeURIComponent(options.url),
      title: decodeURIComponent(options.title),
      debug: JSON.parse(options.debug),
      share_logo: decodeURIComponent(options.share_logo)
    })
  },

  onShareAppMessage() {
    wx.exitMiniProgram()
    return {
      title: this.data.title,
      imageUrl: this.data.share_logo,
      path: `/pages/index/index?url=${encodeURIComponent(this.data.url)}`
    }
  },

  closeSelf() {
    wx.exitMiniProgram()
  },

  handleContact(e) {
    wx.openCustomerServiceChat({
      extInfo: { url: this.data.service_url },
      corpId: this.data.service_corp,
      success: res => {
        console.debug(res)
      },
      fail: res => {
        wx.showModal({
          title: '打开错误',
          content: JSON.stringify(res)
        })
      }
    })
  }
})
