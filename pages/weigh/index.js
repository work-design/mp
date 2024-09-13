import { createBLEConnection, startBluetoothDevicesDiscovery, getBluetoothAdapterState } from '../../utils/ble'
import { weigher } from '../../behaviors/weigher'

Page({
  data: {
    devices: [],
    chs: []
  },

  behaviors: [weigher],

  onLoad(options) {
    console.debug('weigh onload', options)
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
    wx.stopBluetoothDevicesDiscovery({
      complete: res => {
        console.debug('停止蓝牙扫描', res)
        startBluetoothDevicesDiscovery(this)
      }
    })
  },

  doWeigh() {
    wx.request({
      url: this.data.url,
      header: {
        Accept: 'application/json',
        Authorization: wx.getStorageSync('authToken')
      },
      body: {
        value: this.data.value
      },
      success: res => {

      },
      complete: res => {
        console.debug(res)
      }
    })
  }
})
