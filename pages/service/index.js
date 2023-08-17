Page({
  data: {

  },
  onLoad() {
    wx.request({
      url: wx.getExtConfigSync().host + '/wechat/app_configs',
      data: { appid: wx.getAccountInfoSync().miniProgram.appId },
      success: (res) => {
        this.setData(res.data)
      },
      complete: (res) => {
        console.debug(res)
      }
    })
  },
  handleContact(e) {
    wx.openCustomerServiceChat({
      extInfo: { url: this.data.service_url },
      corpId: this.data.service_corp,
      success(res) {
        console.debug(res)
      },
      fail(res) {
        console.debug(res)
      }
    })
  },
  handBack() {
    wx.navigateBack()
  }
})
