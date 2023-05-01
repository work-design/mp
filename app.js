// app.js

App({
  onLaunch(options) {
    const x = wx.getExtConfigSync()
    console.debug('ext Config:', x)
  }
})
