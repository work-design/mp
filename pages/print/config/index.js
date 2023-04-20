import {
  createBLEConnection,
  writeBLECharacteristicValue,
  startBluetoothDevicesDiscovery,
  getBluetoothAdapterState
} from '../../../utils/ble'

Page({
  data: {
    devices: [],
    chs: []
  },
  onLoad(options) {
    console.debug('onload', options)
    this.setData({
      connectedDeviceId: wx.getStorageSync('printer').deviceId // 只有当连接成功的才赋值, 当断开时会取消赋值
    })
    getBluetoothAdapterState(this)
  },
  startBluetoothDevicesDiscovery() {
    startBluetoothDevicesDiscovery(this)
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
        console.debug('closeBLEConnection success', res)
        this.setData({ connectedDeviceId: '' })
        wx.removeStorageSync('printer')
      }
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      complete(res) {
        console.debug('stopBluetoothDevicesDiscovery complete', res)
      }
    })
  },
  doPrint() {
    writeBLECharacteristicValue()
  }
})
