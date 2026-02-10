const WEBVIEW_HOST = 'https://zl.one.work'
const PATH = 'trade/my/orders'

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
  }
})
