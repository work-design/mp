const WEBVIEW_HOST = wx.getExtConfigSync().webview_host
const PATH = wx.getExtConfigSync().path

Page({
  onLoad(query) {
    console.debug('index onLoad:', query)
    let url
    if (PATH) {
      url = WEBVIEW_HOST + (PATH.startsWith('/') ? PATH : `/${PATH}`)
    } else {
      url = WEBVIEW_HOST
    }

    if (query.url) {
      this.setData({
        url: decodeURIComponent(query.url)
      })
    } else if (Object.keys(query).includes('path')) {
      const path = decodeURIComponent(query.path)
      this.setData({
        url: WEBVIEW_HOST + (path.startsWith('/') ? path : `/${path}`)
      })
    } else if (query.scene) {
      const path = decodeURIComponent(query.scene)
      if (path.startsWith('/')) {
        this.setData({
          url: WEBVIEW_HOST + path
        })
      } else {
        this.setData({
          url: url
        })
      }
    } else {
      this.setData({
        url: url
      })
    }
  },

  onWebMessage(e) {
    console.debug('onWebMessage', e)

    const msg = e.detail.data[e.detail.data.length - 1]
    if (msg) {
      this.title = `${msg.organ}的小店`
    } else {
      this.title = '邀请您下单'
      wx.showModal({
        title: 'message get fail',
        content: JSON.stringify(e.detail.data)
      })
    }
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
    console.debug('shared path:', path)

    return {
      title: this.title,
      path: `/pages/index/index?url=${path}`
    }
  },

  onShareTimeline(options) {
    console.debug('onShareTimeline', options.webViewUrl)
  }
})
