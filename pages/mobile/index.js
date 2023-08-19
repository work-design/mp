Page({
  data: {
    avatarUrl: '',
    authToken: wx.getStorageSync('authToken'),
    programUser: wx.getStorageSync('programUser')
  },
  onLoad(query) {
    console.debug('onLoad query:', query)

  },
  onPullDownRefresh() {
    wx.startPullDownRefresh()
  },
  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  },
  getPhoneNumber(e) {
    wx.request({
      url: HOST + '/wechat/program_users/mobile',
      method: 'POST',
      data: {
        detail: e.detail,
        auth_token: wx.getStorageSync('authToken')
      },
      success: res => {
        page.setData({ programUser: res.data.program_user })
      }
    })
  }
})
