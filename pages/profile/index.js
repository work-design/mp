Page({
  data: {
    avatarUrl: '',
    authToken: wx.getStorageSync('authToken'),
    programUser: wx.getStorageSync('programUser')
  },
  onLoad(query) {
    console.debug('profile query:', query)
  },
  onPullDownRefresh() {
    wx.startPullDownRefresh()
  },
  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  }
})
