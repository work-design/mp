// index.js
// 获取应用实例
import { getPhoneNumber, wxLogin } from '../../utils/login'
import { setPath } from '../../utils/util'
import { AVATAR } from '../../config'

Page({
  data: {
    path: '/board',
    avatarUrl: AVATAR
  },
  onLoad(query) {
    console.debug('onLoad query:', query)
    if (query.login === 'true') {
      wxLogin(this)
    } else {
      this.setData({
        authToken: wx.getStorageSync('authToken'),
        programUser: wx.getStorageSync('programUser')
      })
      if (!this.data.programUser) {
        wxLogin(this)
      }
    }

    setPath(query, this)
  },
  onShareAppMessage(options) {
    const url = new webkitURL(options.webViewUrl)
    url.searchParams.delete('auth_token')
    const path = `${url.pathname}${url.search}`
    return {
      title: '自定义转发标题',
      path: `/page/index/index?path=${path}`
    }
  },
  onShareTimeline(options) {
    console.debug('onShareTimeline', options.webViewUrl)
  },
  onPullDownRefresh() {
    wx.startPullDownRefresh()
  },
  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  },
  getPhoneNumber(e) {
    getPhoneNumber(e, this)
  }
})
