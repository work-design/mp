const HOST = wx.getExtConfigSync().host
import {
  createBLEConnection,
  writeBLECharacteristicValue,
  restartBluetoothDevicesDiscovery,
  getBluetoothAdapterState
} from '../../utils/ble'

Page({
  data: {
    devices: [],
    registeredDevices: [],
    chs: [],
    printer: {}
  },
  onLoad(options) {
    console.debug('print onload', options)
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
    getBluetoothAdapterState(this)
  },

  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    createBLEConnection(deviceId, this)
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
    restartBluetoothDevicesDiscovery(this)
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
            writeBLECharacteristicValue(this.data.printer, data)
          })
        } else {
          writeBLECharacteristicValue(this.data.printer, res.data)
        }
      },
      complete: res => {
        console.debug(res)
      }
    })
  }
})
