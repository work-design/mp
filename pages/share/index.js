const HOST = wx.getExtConfigSync().host
const appid = wx.getAccountInfoSync().miniProgram.appId

Page({
  onLoad(query) {
    console.debug('Share Onload:', query)
    this.setData({
      url: decodeURIComponent(query.url),
      title: decodeURIComponent(query.title),
      debug: JSON.parse(query.debug)
    })

    wx.downloadFile({
      url: decodeURIComponent(query.share_logo),
      success: res => {
        this.setData({ share_logo: res.tempFilePath })
      }
    })

    wx.request({
      url: HOST + `/wechat/apps/${appid}/configs`,
      success: (res) => {
        this.setData(res.data)
      },
      complete: (res) => {
        console.debug(res)
      }
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.title,
      imageUrl: this.data.share_logo,
      path: `/pages/index/index?url=${encodeURIComponent(this.data.url)}`
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
