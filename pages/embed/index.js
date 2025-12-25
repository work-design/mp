Page({
  onLoad(query) {
    console.debug('Share Onload:', query)

    wx.openEmbeddedMiniProgram({
      appId: 'wxe44dc002dd0d29b0',
      path: `/pages/share/index?${query}`
    })
  }

})
