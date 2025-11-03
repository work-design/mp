const plugin = requirePlugin('bluetooth')

Page({
  data: {
    state: '正在连接打印机...'
  },

  onLoad(options) {
    console.debug('print onload', options)
    const url = decodeURIComponent(options.url)
    const devices = [options.device]
    this.setData({ registeredDevices: devices })

    this.printer = new plugin.BluetoothPrinter(wx)
    this.printer.registeredDevices = devices
    this.printer.getState({
      success: (res) => {
        console.debug('print state', res)
        this.setData({
          state: '打印机已连接，即将打印'
        })
        this.doPrint(url)
      },
      complete: res => {
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
