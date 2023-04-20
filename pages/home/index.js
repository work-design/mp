import { HOST } from '../../config'

Page({
  data: {
    host: HOST,
    authToken: wx.getStorageSync('auth_token'),
    path: ''
  },
  onLoad(options) {
  },
  onShareAppMessage(options) {
    console.log(options.webViewUrl)
  },
  onShareTimeline(options) {
    console.log(options.webViewUrl)
  }
})
