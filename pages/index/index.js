const HOST = wx.getExtConfigSync().host
const PATH = wx.getExtConfigSync().path

Page({
  data: {
    url: HOST + (PATH.startsWith('/') ? PATH : `/${PATH}`)
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
