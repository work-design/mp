import { HOST } from '../../config'

Page({
  data: {
    url: `${HOST}/board`
  },
  onLoad(query) {
    console.debug('index/index onLoad query:', query)

    let url = new URL(this.data.url)
    if (query.url) {
      url = new URL(query.url)
    }
    url.searchParams.set('auth_token', wx.getStorageSync('authToken'))
    if (Object.keys(query).includes('path')) {
      url.pathname = decodeURIComponent(query.path)
    }
    if (query.org_id) {
      url.pathname = `org_${query.org_id}` + url.pathname
    }
    this.setData({url: url})
  },
  onShareAppMessage(options) {
    const url = new URL(options.webViewUrl)
    url.searchParams.delete('auth_token')
    const path = `${url.pathname}${url.search}`
    return {
      title: '自定义转发标题',
      path: `/page/index/index?path=${path}`
    }
  },
  onShareTimeline(options) {
    console.debug('onShareTimeline', options.webViewUrl)
  }
})
