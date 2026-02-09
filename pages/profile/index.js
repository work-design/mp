const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    name: ''
  },
  onLoad(query) {
    console.debug('profile query:', query)
    this.setData({
      url: decodeURIComponent(query.url)
    })
    wx.request({
      url: this.data.url,
      header: {
        Accept: 'application/json'
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
      url: this.data.url,
      method: 'PATCH',
      filePath: e.detail.avatarUrl,
      name: 'user[avatar]',
      header: {
        Accept: 'application/json'
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
        url: this.data.url,
        method: 'PATCH',
        header: {
          Accept: 'application/json',
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
