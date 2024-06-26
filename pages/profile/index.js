const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const HOST = wx.getExtConfigSync().host

Page({
  data: {
    avatarUrl: wx.getStorageSync('user').avatar_url || defaultAvatarUrl,
    name: wx.getStorageSync('user').name
  },
  onLoad(query) {
    console.debug('profile query:', query)
    wx.request({
      url: HOST + '/auth/board/user',
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      success: res => {
        this.setData({
          name: res.data.name,
          initName: res.data.name,
          avatarUrl: res.data.avatar_url
        })
      }
    })
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
  clearInput(e) {
    console.debug('clearInput:', e)
    e.currentTarget.value = ''
    this.setData({ name: '' })
  },
  revertInput(e) {
    console.debug('rever:', e)
    if (e.detail.value.length === 0) {
      this.setData({name: this.data.initName})
    }
  },
  onChangeName(e) {

  },
  formSubmit(e) {
    console.debug('formSubmit:', e)
    if (e.detail.value) {
      wx.request({
        url: HOST + '/auth/board/user',
        method: 'POST',
        header: {
          Accept: 'application/json',
          Authorization: wx.getStorageSync('authToken')
        },
        data: {
          user: e.detail.value
        },
        success() {
          wx.navigateBack()
        }
      })
    } else {
      wx.navigateBack()
    }
  }
})
