import {
  createBLEConnection,
  writeBLECharacteristicValue,
  restartBluetoothDevicesDiscovery,
  getBluetoothAdapterState
} from '../../utils/ble'

Page({
  data: {
    devices: [],
    chs: []
  },
  onLoad(options) {
    console.debug('print onload', options)
    const printer = wx.getStorageSync('printer') || {}
    this.setData({
      url: decodeURIComponent(options.url),
      printer: printer // 只有当连接成功的才赋值, 当断开时会取消赋值
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
