export const changeStorageSync = (key, ...options) => {
  const result = wx.getStorageSync(key)
  if (typeof result !== 'object') { return }
  Object.assign(result, ...options)
  wx.setStorageSync(key, result)
}
