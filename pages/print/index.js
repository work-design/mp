const HOST = wx.getExtConfigSync().host
const plugin = requirePlugin('bluetooth')

Page({
  data: {
    state: '正在连接打印机...',
    host: HOST
  },

  onLoad(options) {
    console.debug('print onload', options)
    const printer = new plugin.BluetoothPrinter()
    const url = decodeURIComponent(options.url)

    wx.request({
      url: HOST + '/bluetooth/devices',
      header: {
        Accept: 'application/json'
      },
      success: res => {
        printer.registeredDevices = res.data.devices
        this.setData({ registeredDevices: res.data.devices })
      },
      fail: res => {
        wx.showModal({
          title: 'request fail',
          content: JSON.stringify(res)
        })
      }
    })

    printer.getState({
      success: (res) => {
        this.setData({
          state: '打印机已连接，即将打印'
        })
        this.doPrint(printer, url)
        wx.navigateBack()
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

    this.printer = printer
  },

  printLocal(printer) {
    const cpcl = new plugin.PrintCPCL()
    cpcl.text('你好呀')
    cpcl.text_bold('haohao好')
    const data = cpcl.render()
    console.debug(data)
    this.xxx = data
    printer.writeBuffer(data)
  },

  doPrint(printer, url) {
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
            printer.writeValue(data)
          })
        } else {
          printer.writeValue(res.data)
        }
      },
      complete: res => {
        wx.showModal({
          title: 'do Print fail',
          content: JSON.stringify(res)
        })
      }
    })
  }
})
