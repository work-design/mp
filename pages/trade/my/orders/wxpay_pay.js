import { setPath } from '../../../../utils/util'

Page({
  data: {
    authToken: wx.getStorageSync('authToken')
  },
  onLoad(query) {
    setPath(query, this)
    wx.request({
      url: decodeURIComponent(query.url) + '.json',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('authToken')
      },
      data: {
        appid: wx.getAccountInfoSync().miniProgram.appId
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          wx.requestPayment({
            ...res.data,
            success(res) {
              console.debug(res)
            },
            fail(res) {
              console.debug(res)
            }
          })
        } else {
          wx.showModal({
            title: 'status code fails',
            content: JSON.stringify(res.data)
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: 'request fail',
          content: JSON.stringify(res)
        })
      }
    })
  }

})
