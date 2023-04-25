import { HOST, APPID } from '../config'

// 登录
export const wxLogin = (page) => {
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: HOST + '/wechat/program_users',
          method: 'POST',
          data: {
            code: res.code,
            appid: APPID
          },
          success: res => {
            wx.setStorageSync('auth_token', res.data.auth_token)
            page.setData({ authToken: res.data.auth_token })
            if (res.data.user) {
              wx.setStorageSync('user', res.data.user)
              page.setData({ userInfo: res.data.user })
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    },
    fail: res => {
      console.debug(res)
    }
  })
}

export const getPhoneNumber = (e, page) => {
  if (e.detail.iv) {
    wx.request({
      url: HOST + '/wechat/program_users/mobile',
      method: 'POST',
      data: {
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        code: e.detail.code,
        auth_token: wx.getStorageSync('auth_token')
      },
      success: res => {
        if (res.data.user) {
          page.setData({
            userInfo: res.data.user
          })
        }
      }
    })
  } else {
    console.log('登录失败！' + e)
  }
}

export const wxInfo = () => {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    }
  })
}

export const getUserProfile = (page) => {
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  wx.getUserProfile({
    desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: res => {
      console.debug('getUserProfile success', res)
      page.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
  })
}

export const getUserInfo = (page) => {
  // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  console.debug(e)
  page.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
  })
}
