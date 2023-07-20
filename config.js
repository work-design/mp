const sys = wx.getSystemInfoSync()
const debug = false
let host
if (sys.platform === 'devtools' && debug) {
  host = 'https://test.work.design'
} else {
  host = wx.getExtConfigSync().host
}
export const HOST = host
export const APPID = wx.getAccountInfoSync().miniProgram.appId
export const AVATAR = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
