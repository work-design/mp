import { HOST } from '../../config'

Page({
  data: {
    host: HOST,
    path: '/board',
    authToken: wx.getStorageSync('authToken')
  },
  onLoad(query) {
    console.debug('onLoad query:', query)
    const _data = {}
    if (query.org_id) {
      _data.host = HOST + `/org_${query.org_id}`
    }
    if (Object.keys(query).includes('path')) {
      if (query.path.startsWith('/') || query.path.startsWith('%2F')) {
        _data.path = decodeURIComponent(query.path)
      } else {
        _data.path = decodeURIComponent(`/${query.path}`)
      }
    } else {
      _data.path = this.data.path
    }
    if (query.state) {
      _data.path = `${_data.path}?state=query.state`
    }
    this.setData(_data)
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
  }
})
