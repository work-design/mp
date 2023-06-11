## 快捷文档
* [project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)


## ext 配置格式

```json
{
  "extAppid": "",
  "ext": {
    "host": ""
  },
  "window": {}
}
```

## 云函数调用示例

```js
wx.cloud.callFunction({ 
  name: 'msg_sec_check',
  data: { content: 'flg' }
}).then(result => {
  console.log(1, result.result, 2) 
})
```
