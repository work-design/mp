const WEBVIEW_HOST = wx.getExtConfigSync().webview_host
const PATH = wx.getExtConfigSync().path

Page({
  onLoad(query) {
    console.debug('index onLoad:', query)
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
    } else {
      url = WEBVIEW_HOST + (PATH.startsWith('/') ? PATH : `/${PATH}`)
    }

    this.setData({ url: url })
  },

  onWebMessage(e) {
    console.debug('onWebMessage', e)
    // 只会退、销毁、分享前触发
    const msg = e.detail.data[e.detail.data.length - 1]
    this.organ = msg.organ
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
      title: `${this.organ}的小店`,
      path: `/pages/index/index?url=${path}`
    }
  },

  onShareTimeline(options) {
    console.debug('onShareTimeline', options.webViewUrl)
  }
})
