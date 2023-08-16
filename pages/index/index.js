import { HOST } from '../../config'

Page({
  data: {
    url: `${HOST}/board`
  },
  onLoad(query) {
    console.debug('onLoad query:', query)
    const url = new webkitURL(this.data.url)
    url.searchParams.set('auth_token', wx.getStorageSync('authToken'))
    if (query.org_id) {
      url.path = `/org_${query.org_id}` + url.path
    }
    if (Object.keys(query).includes('path')) {
      if (query.path.startsWith('/') || query.path.startsWith('%2F')) {
        url.path = decodeURIComponent(query.path)
      } else {
        url.path = decodeURIComponent(`/${query.path}`)
      }
    }
    if (query.state) {
      url.searchParams.set('state', query.state)
    }
    this.setData({url: url})
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
  }
})
