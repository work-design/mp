const HOST = wx.getExtConfigSync().host
import BluetoothPrinter from '../../utils/ble'

Page({
  data: {
    devices: [],
    registeredDevices: [],
    chs: [],
    printer: {}
  },

  onLoad(options) {
    console.debug('print onload', options)
    const printer = new BluetoothPrinter(this)
    this.setData({
      url: decodeURIComponent(options.url),
    })
    wx.request({
      url: HOST + '/bluetooth/devices',
      header: {
        Accept: 'application/json'
      },
      success: res => {
        this.setData({
          registeredDevices: res.data.devices
        })
      }
    })
    this.getBluetoothAdapterState()
  },

  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    printer.createBLEConnection(deviceId)
  },

  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.printer.deviceId,
      success: res => {
        console.debug('断开与蓝牙设备的连接', res)
        this.setData({ printer: {} })
      }
    })
  },

  restartBluetoothDevicesDiscovery() {
    printer.restartBluetoothDevicesDiscovery
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
            printer.writeBLECharacteristicValue(data)
          })
        } else {
          printer.writeBLECharacteristicValue(res.data)
        }
      },
      complete: res => {
        console.debug(res)
      }
    })
  }
})
