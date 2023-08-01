import { getPhoneNumber, wxLogin } from '../../utils/login'
import { setPath } from '../../utils/util'
import { AVATAR } from '../../config'

Page({
  data: {
    path: '/board',
    avatarUrl: AVATAR,
    authToken: wx.getStorageSync('authToken'),
    programUser: wx.getStorageSync('programUser')
  },
  onLoad(query) {
    console.debug('onLoad query:', query)
    setPath(query, this)
    this.setData({
      logining: query.login === 'true'
    })
    if (this.data.logining || !this.data.programUser) {
      wxLogin(this)
    }
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
