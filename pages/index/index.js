const WEBVIEW_HOST = wx.getExtConfigSync().webview_host
const PATH = wx.getExtConfigSync().path
const URL = WEBVIEW_HOST + (PATH.startsWith('/') ? PATH : ('/' + PATH))

Page({
  onLoad(query) {
    console.debug('index onLoad:', query)
    wx.showModal({
      title: 'Index On load',
      content: JSON.stringify(query)
    })
    if (query.url) {
      this.setData({
        url: decodeURIComponent(query.url)
      })
      wx.showModal({
        title: 'Index On url',
        content: JSON.stringify(this.data)
      })
    } else if (Object.keys(query).includes('path')) {
      const path = decodeURIComponent(query.path)
      this.setData({
        url: WEBVIEW_HOST + (path.startsWith('/') ? path : `/${path}`)
      })
      wx.showModal({
        title: 'Index On load: path',
        content: JSON.stringify(this.data)
      })
    } else if (query.scene) {
      const path = decodeURIComponent(query.scene)
      if (path.startsWith('/')) {
        this.setData({
          url: WEBVIEW_HOST + path
        })
      } else {
        this.setData({
          url: URL
        })
      }
      wx.showModal({
        title: 'Index On load: scene',
        content: JSON.stringify(this.data)
      })
    } else {
      this.setData({
        url: URL
      })
      wx.showModal({
        title: 'Index On load: else',
        content: JSON.stringify(this.data)
      })
    }

    wx.showModal({
      title: 'Index On load: Data',
      content: JSON.stringify(this.data)
    })
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
