const HOST = wx.getExtConfigSync().host

Page({
  onLoad() {
    wx.request({
      url: HOST + '/wechat/apps',
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

  onShareAppMessage() {
    const url = 'https://one.work/factory/productions'

    return {
      title: '官方门店',
      webViewUrl: this.data.share_logo,
      path: `/pages/index/index?url=${url}`
    }
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
