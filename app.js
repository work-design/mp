// app.js

App({
  onLaunch(options) {
    const x = wx.getExtConfigSync()
    console.log('rrr', x)
  }
})
