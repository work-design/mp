const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const HOST = wx.getExtConfigSync().host

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
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
    wx.xx = e
    this.setData({ avatarUrl: e.detail.avatarUrl })
    wx.uploadFile({
      url: HOST + '/auth/board/user',
      filePath: e.detail.avatarUrl,
      name: 'user[avatar]',
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      }
    })
  }
})
