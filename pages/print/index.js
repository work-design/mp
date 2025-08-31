const HOST = wx.getExtConfigSync().host
import BluetoothPrinter from '../../utils/ble'

Page({
  data: {
    devices: [],
    chs: [],
    printer: {}
  },

  onLoad(options) {
    console.debug('print onload', options)
    this.printer = new BluetoothPrinter()
    this.setData({
      url: decodeURIComponent(options.url),
    })
    wx.request({
      url: HOST + '/bluetooth/devices',
      header: {
        Accept: 'application/json'
      },
      success: res => {
        this.printer.registeredDevices = res.data.devices
      }
    })

    this.printer.getState(res => {
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
  },

  doPrint() {
    console.debug('print url', this.data.url)
    wx.request({
      url: this.data.url,
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
