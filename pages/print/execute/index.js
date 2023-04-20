import {
  getBluetoothAdapterState,
  writeBLECharacteristicValue
} from '../../../utils/ble'

Page({
  data: {
    devices: [],
    chs: [],
    url: '',
    debug: ''
  },
  onLoad(options) {
    console.debug('onload', options)
    this.setData({
      url: decodeURIComponent(options.url),
      printer: wx.getStorageSync('printer'),
      connectedDeviceId: wx.getStorageSync('printer').deviceId
    })
    getBluetoothAdapterState(this)
  },
  doPrint() {
    wx.request({
      url: this.data.url,
      success: res => {
        writeBLECharacteristicValue(this.data.printer, res.data)
      },
      complete: res => {
        console.debug(res)
      }
    })
  }
})
