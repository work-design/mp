const HOST = wx.getExtConfigSync().host

Page({
  data: {
  },

  onLoad() {
    wx.request({
      url: HOST + '/wechat/app_configs',
      data: { 
        appid: wx.getAccountInfoSync().miniProgram.appId 
      },
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
