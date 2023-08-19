const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const HOST = wx.getExtConfigSync().host

Page({
  data: {
    avatarUrl: defaultAvatarUrl
  },
  onLoad(query) {
    console.debug('profile query:', query)
  },
  onPullDownRefresh() {
    wx.startPullDownRefresh()
  },
  onChooseAvatar(e) {
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
  },
  inputName(e) {
    this.setData({ name: e.detail.value })
  },
  onChangeName() {
    wx.request({
      url: HOST + '/auth/board/user',
      method: 'POST',
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      data: {
        user: {
          name: this.data.name
        }
      }
    })
  }
})
