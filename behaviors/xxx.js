
if (item.properties.notify || item.properties.indicate) {
  wx.notifyBLECharacteristicValueChange({
    deviceId,
    serviceId,
    characteristicId: item.uuid,
    state: true
  })
}

if (item.properties.read) {
  wx.readBLECharacteristicValue({
    deviceId,
    serviceId,
    characteristicId: item.uuid,
    success: res => {
      console.debug('读取蓝牙设备特征值的二进制数据', item.uuid, res)
    }
  })
}