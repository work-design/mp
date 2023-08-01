import { getPhoneNumber } from '../../utils/login'
import { setPath } from '../../utils/util'
import { APPID, HOST } from "../../config";

Page({
  data: {
  },
  onLoad(query) {
    console.debug('onLoad query:', query)
    this.setData({
      url: query.url
    })
    wx.login({
      success: res => {
        wx.request({
          url: HOST + '/wechat/program_users',
          method: 'POST',
          data: {
            code: res.code,
            appid: APPID
          },
          success: res => {
            wx.setStorageSync('authToken', res.data.auth_token)
            wx.setStorageSync('programUser', res.data.program_user)
            wx.redirectTo({
              url: `/pages/index/index?path=${query.xx}`
            })
          }
        })
      },
      fail: res => {
        console.debug('wx.login fail:', res)
      }
    })
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
