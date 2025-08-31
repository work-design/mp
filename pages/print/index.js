const HOST = wx.getExtConfigSync().host
import BluetoothPrinter from '../../utils/ble'

Page({
  data: {
    state: '正在连接打印机...'
  },

  onLoad(options) {
    console.debug('print onload', options)
    const printer = new BluetoothPrinter()
    const url = decodeURIComponent(options.url)

    wx.request({
      url: HOST + '/bluetooth/devices',
      header: {
        Accept: 'application/json'
      },
      success: res => {
        printer.registeredDevices = res.data.devices
      }
    })

    printer.getState(res => {
      wx.request({
        url: HOST + '/bluetooth/devices/err',
        method: 'POST',
        header: {
          Accept: 'application/json'
        },
        data: {
          api: 'openBluetoothAdapter',
          message: res
        },
        success: res => {
        }
      })
    })

    this.setData({ state: '打印机已连接，即将打印' })
    this.doPrint(printer, url)
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
        console.debug(res)
      }
    })
  }
})
