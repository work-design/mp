const APPID = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('Mobile query:', query)
    this.setData({
      url: decodeURIComponent(query.url)
    })
  },

  getPhoneNumber(e) {
    wx.request({
      url: this.data.url,
      method: 'POST',
      header: {
        Accept: 'application/json'
      },
      data: {
        appid: APPID,
        ...e.detail
      },
      success: res => {
        wx.navigateBack()
      }
    })
  }
})
