## 快捷文档
* [project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)


## ext 配置格式

```json
{
  "extAppid": "",
  "ext": {
    "host": "",
    "auth_host": "",
    "path": ""
  },
  "window": {}
}
```


wx.onBLEConnectionStateChange(res => {
console.debug(`${res.deviceId} 状态已改变, 连接状态: ${res.connected}`)
const result = wx.getStorageSync('printer')
if (result.deviceId === res.deviceId && !res.connected) {
Object.assign(result, { connected: false })
wx.setStorageSync('printer', result)
}
})
