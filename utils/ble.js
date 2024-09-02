import { changeStorageSync } from './helper'
// 初始化蓝牙模块
export const openBluetoothAdapter = (page) => {
  wx.openBluetoothAdapter({
    success: res => {
      console.debug('openBluetoothAdapter success', res, page.data.connectedDeviceId)
      if (page.data.connectedDeviceId) {
        createBLEConnection(page.data.connectedDeviceId, page)
      } else {
        startBluetoothDevicesDiscovery(page)
      }
    },
    fail(res) {
      console.debug('openBluetoothAdapter fail', res)
    }
  })
}

// 获取本机蓝牙适配器状态
export const getBluetoothAdapterState = (page) => {
  wx.getBluetoothAdapterState({
    success: res => {
      console.debug('getBluetoothAdapterState success', res, page.data.connectedDeviceId)
      const state = res.adapterState || res
      if (state.discovering) {
        onBluetoothDeviceFound(page)
      } else if (state.available) {
        if (page.data.connectedDeviceId) {
          createBLEConnection(page.data.connectedDeviceId, page)
        } else {
          startBluetoothDevicesDiscovery(page)
        }
      } else {
        console.log(state)
      }
    },
    fail: res => {
      console.debug('getBluetoothAdapterState fail', res)
      openBluetoothAdapter(page)
    }
  })
}

export const startBluetoothDevicesDiscovery = (page) => {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: res => {
      console.debug('startBluetoothDevicesDiscovery success', res)
      onBluetoothDeviceFound(page)
    },
    fail: res => {
      console.debug('startBluetoothDevicesDiscovery fail', res)
    }
  })
}

export const onBluetoothDeviceFound = (page) => {
  wx.onBluetoothDeviceFound(res => {
    console.debug('onBluetoothDeviceFound', res.devices[0].name, res.devices)
    saveDevices(res.devices, page)
  })
}

export const saveDevices = (devices, page) => {
  devices.forEach(device => {
    if (!device.name && !device.localName) { return }
    //if (!device.connectable) { return }
    const foundDevices = page.data.devices
    const item = foundDevices.find(e => e.deviceId === device.deviceId)
    if (item) {
      Object.assign(item, device)
    } else {
      foundDevices.push(device)
    }
    page.setData({ devices: foundDevices })
  })
}

// 获取蓝牙低功耗设备某个服务中所有特征
export const getBLEDeviceCharacteristics = (deviceId, serviceId, page) => {
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: res => {
      for (const item of res.characteristics) {
        console.debug('device id:', deviceId, 'service id:', serviceId, 'characteristic id', item.uuid)
        if (item.properties.read) {
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            success (res) {
              console.log('-----------readBLECharacteristicValue:', res)
            }
          })
        }
        if (item.properties.write && item.properties.writeNoResponse) {
          console.debug('who can write', item.uuid, item)
          changeStorageSync('printer', {
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: item.uuid
          })
        }
        if (item.properties.notify || item.properties.indicate) {
          wx.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true
          })
        }
      }
    },
    fail(res) {
      console.error('getBLEDeviceCharacteristics', res)
    }
  })

  // 操作之前先监听，保证第一时间获取数据
  wx.onBLECharacteristicValueChange(characteristic => {
    const foundChs = page.data.chs
    const item = foundChs.find(e => e.uuid === characteristic.characteristicId)
    if (item) {
      Object.assign(item, {
        uuid: characteristic.characteristicId,
        value: ab2hex(characteristic.value)
      })
    } else {
      foundChs.push({
        uuid: characteristic.characteristicId,
        value: ab2hex(characteristic.value)
      })
    }
    const v = ab2hex(characteristic.value)
    console.debug('-------------', v.match(/.{1,2}/g).map(i => String.fromCharCode(parseInt(i, 16))).join())

    page.setData({ chs: foundChs })
  })
}

export const writeBLECharacteristicValue = (printer, data) => {
  const maxChunk = 20

  while (data.length > 0) {
    let subData = data.splice(0, maxChunk)
    let buffer = new ArrayBuffer(subData.length)
    let uint = new Uint8Array(buffer)
    uint.set(subData)

    console.debug('test buffer', buffer)

    wx.writeBLECharacteristicValue({
      deviceId: printer.deviceId,
      serviceId: printer.serviceId,
      characteristicId: printer.characteristicId,
      value: buffer,
      writeType: 'write',
      success(res) {
        console.debug('write success', res.errMsg)
      },
      fail(res) {
        console.debug('fail', res)
      }
    })
  }
}

// 获取蓝牙低功耗设备所有服务 (service)
export const getBLEDeviceServices = (deviceId, page) => {
  wx.getBLEDeviceServices({
    deviceId,
    success: res => {
      for (const item of res.services) {
        if (item.isPrimary) {
          console.debug('device id:', deviceId, 'primary service id:', item.uuid)
          getBLEDeviceCharacteristics(deviceId, item.uuid, page)
        }
      }
    }
  })
}

export const createBLEConnection = (deviceId, page) => {
  wx.createBLEConnection({
    deviceId,
    success: res => {
      console.debug('createBLEConnection success', res)
      page.setData({ connectedDeviceId: deviceId })
      wx.setStorageSync('printer', { deviceId: deviceId, connected: true })
      getBLEDeviceServices(deviceId, page)
      wx.onBLEConnectionStateChange(res => {
        console.debug(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
        const result = wx.getStorageSync('printer')
        if (result.deviceId === res.deviceId && !res.connected) {
          Object.assign(result, { connected: false })
          wx.setStorageSync('printer', result)
        }
      })
      getBluetoothDevice(deviceId, page)
      wx.stopBluetoothDevicesDiscovery({
        complete(res) {
          console.debug('stopBluetoothDevicesDiscovery complete', res)
        }
      })
    },
    fail(res) {
      console.debug('createBLEConnection fail', res)
    }
  })
}

export const getBluetoothDevice = (deviceId, page) => {
  wx.getBluetoothDevices({
    success: res => {
      console.debug('getBluetoothDevices success', res)
      const device = res.devices.find(e => e.deviceId === deviceId)
      const foundDevices = page.data.devices
      const item = foundDevices.find(e => e.deviceId === device.deviceId)
      if (item) {
        Object.assign(item, device)
      } else {
        foundDevices.push(device)
      }
      page.setData({ devices: foundDevices })
    }
  })
}

// ArrayBuffer 转 16 进度字符串
const ab2hex = (buffer) => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('')
}
