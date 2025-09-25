const WEBVIEW_HOST = wx.getExtConfigSync().webview_host
const PATH = wx.getExtConfigSync().path

Page({
  data: {
    url: WEBVIEW_HOST + (PATH.startsWith('/') ? PATH : `/${PATH}`)
  },

  onLoad(query) {
    console.debug('index onLoad query:', query)
    let url = this.data.url
    if (query.url) {
      url = decodeURIComponent(query.url)
    } else if (Object.keys(query).includes('path')) {
      const path = decodeURIComponent(query.path)
      url = WEBVIEW_HOST + (path.startsWith('/') ? path : `/${path}`)
    } else if (query.scene) {
      const path = decodeURIComponent(query.scene)
      if (path.startsWith('/')) {
        url = WEBVIEW_HOST + path
      }
    }
    this.setData({ url: url })
  },

  onShareAppMessage(options) {
    let path
    const [base, search] = options.webViewUrl.split('?')
    if (search) {
      const pairs = search.split('&').filter(kv => !kv.startsWith('auth_token='))
      path = pairs.length ? `${base}?${pairs.join('&')}` : base
    } else {
      path = base
    }
    console.debug('shared path', path)

    return {
      title: '自定义转发标题',
      path: `/page/index?path=${path}`
    }
  },

  onShareTimeline(options) {
    console.debug('onShareTimeline', options.webViewUrl)
  }
})
