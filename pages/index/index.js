const HOST = wx.getExtConfigSync().host
Page({
  data: {
    url: `${HOST}/board`
  },
  onLoad(query) {
    console.debug('index/index onLoad query:', query)
    let url = this.data.url
    if (query.url) {
      url = decodeURIComponent(query.url)
    } else if (Object.keys(query).includes('path')) {
      url = `${HOST}${decodeURIComponent(query.path)}`
    }
    this.setData({ url: url })
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
