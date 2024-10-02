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
    chs: []
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
      deviceId: this.data.connectedDeviceId,
      success: res => {
        console.debug('断开与蓝牙设备的连接', res)
        this.setData({ connectedDeviceId: '' })
        wx.removeStorageSync('printer')
      }
    })
  },

  restartBluetoothDevicesDiscovery() {
    restartBluetoothDevicesDiscovery(this)
  },

  doPrint() {
    const printer = wx.getStorageSync('printer') || {}
    wx.request({
      url: this.data.url,
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      success: res => {
        writeBLECharacteristicValue(printer, res.data)
      },
      complete: res => {
        console.debug(res)
      }
    })
  }
})
