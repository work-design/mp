const HOST = wx.getExtConfigSync().host
const plugin = requirePlugin('bluetooth')

Page({
  data: {
    state: '正在连接打印机...',
    host: HOST
  },

  onLoad(options) {
    console.debug('print onload', options)
    this.printer = new plugin.BluetoothPrinter(wx)
    const url = decodeURIComponent(options.url)

    wx.request({
      url: HOST + '/bluetooth/devices',
      header: {
        Accept: 'application/json'
      },
      success: res => {
        this.printer.registeredDevices = res.data.devices
        this.setData({ registeredDevices: res.data.devices })
        this.printer.getState({
          success: (res) => {
            this.setData({
              state: '打印机已连接，即将打印'
            })
           this.doPrint(url)
          },
          complete: (res) => {
            this.setData({
              devices: res
            })
          },
          fail: res => {
            wx.getSetting({
              success: settingRes => {
                wx.request({
                  url: HOST + '/bluetooth/devices/err',
                  method: 'POST',
                  header: {
                    Accept: 'application/json'
                  },
                  data: {
                    api: 'openBluetoothAdapter',
                    message: res,
                    set: settingRes
                  }
                })
              }
            })
          }
        })
      },
      fail: res => {
        wx.showModal({
          title: 'request fail',
          content: JSON.stringify(res)
        })
      }
    })
  },

  printCpcl() {
    const cpcl = new plugin.PrintCPCL()
    cpcl.text('你好呀')
    cpcl.text_bold('好')
    const data = cpcl.render()
    console.debug(data)
    this.printer.writeBuffer(data)
  },

  printPos() {
    const pos = new plugin.PrintPOS()
    pos.text('一餐之计')
    pos.text_big('一餐之计')
    const data = pos.render()
    this.printer.writeValue(data)
  },

  doPrint(url) {
    console.debug('print url', url)
    wx.request({
      url: url,
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      success: res => {
        if (Array.isArray(res.data[0])) {
          res.data.forEach(data => {
            this.printer.writeValue(data)
          })
        } else {
          this.printer.writeValue(res.data)
        }
        wx.navigateBack()
      },
      fail: res => {
        wx.showModal({
          title: 'do Print fail',
          content: `Url: ${url}，${JSON.stringify(res)}`
        })
      }
    })
  }
})
