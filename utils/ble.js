import { changeStorageSync } from './helper'

export const openBluetoothAdapter = (page) => {
  wx.openBluetoothAdapter({
    success: res => {
      console.debug('初始化蓝牙模块', res, page.data.connectedDeviceId)
      if (page.data.connectedDeviceId) {
        createBLEConnection(page.data.connectedDeviceId, page)
      } else {
        startBluetoothDevicesDiscovery(page)
      }
    },
    fail: res => {
      console.debug('初始化蓝牙模块失败', res)
    }
  })
}

export const getBluetoothAdapterState = (page) => {
  wx.getBluetoothAdapterState({
    success: res => {
      console.debug('获取本机蓝牙适配器状态', res.adapterState)
      const state = res.adapterState || res

      if (state.discovering) {
        onBluetoothDeviceFound(page)
      } else {
        startBluetoothDevicesDiscovery(page)
      }

      if (state.available) {
        if (page.data.connectedDeviceId) {
          createBLEConnection(page.data.connectedDeviceId, page)
        }
      }
    },
    fail: res => {
      console.debug('获取本机蓝牙适配器状态失败', res)
      openBluetoothAdapter(page)
    }
  })
}

export const startBluetoothDevicesDiscovery = (page) => {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: res => {
      console.debug('开始搜寻附近的蓝牙设备', res)
      onBluetoothDeviceFound(page)
    },
    fail: res => {
      console.debug('搜寻附近的蓝牙设备失败', res)
    }
  })
}

export const onBluetoothDeviceFound = (page) => {
  wx.onBluetoothDeviceFound(res => {
    const foundDevices = page.data.devices
    res.devices.forEach(device => {
      if (!device.name && !device.localName) { return }
      if (device.name.includes('未知或不支持的设备')) { return }
      const item = foundDevices.find(e => e.deviceId === device.deviceId)
      if (item) {
        Object.assign(item, device)
      } else {
        console.debug('搜索到新设备', device.name)
        foundDevices.push(device)
      }
    })
    page.setData({ devices: foundDevices })
  })
}

// 获取蓝牙设备服务中所有特征
export const getBLEDeviceCharacteristics = (deviceId, serviceId) => {
  wx.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: res => {
      let table = [
        ['device id', 'service id', 'characteristic id']
      ]
      for (const item of res.characteristics) {
        table.push([deviceId, serviceId, item.uuid])
        if (item.properties.read) {
          wx.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            success: res => {
              console.debug('读取蓝牙设备特征值的二进制数据', res)
            }
          })
        }
        if (item.properties.write && item.properties.writeNoResponse) {
          console.debug('可写入', item.uuid, item)
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
      console.debug(table)
    },
    fail(res) {
      console.error('读取蓝牙设备特征值失败', res)
    }
  })
}

// 操作之前先监听，保证第一时间获取数据
export const onBLECharacteristicValueChange = (page) => {
  wx.onBLECharacteristicValueChange(characteristic => {
    const foundChs = page.data.chs
    const item = foundChs.find(e => e.uuid === characteristic.characteristicId)
    const buffer = Array.from(new Uint8Array(characteristic.value)).map(i => i.toString(16).padStart(2, '0')).join('')

    if (item) {
      Object.assign(item, {
        uuid: characteristic.characteristicId,
        value: buffer
      })
    } else {
      foundChs.push({
        uuid: characteristic.characteristicId,
        value: buffer
      })
    }

    page.setData({ chs: foundChs, buffer: buffer })
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

// 获取蓝牙设备的所有服务
export const getBLEDeviceServices = (deviceId, page) => {
  wx.getBLEDeviceServices({
    deviceId,
    success: res => {
      for (const item of res.services) {
        if (item.isPrimary) {
          console.debug('设备 ID：', deviceId, '主服务：', item.uuid)
          getBLEDeviceCharacteristics(deviceId, item.uuid)
          onBLECharacteristicValueChange(page)
        }
      }
    }
  })
}

export const createBLEConnection = (deviceId, page) => {
  wx.createBLEConnection({
    deviceId,
    success: res => {
      console.debug('连接蓝牙设备', res)
      page.setData({ connectedDeviceId: deviceId })
      wx.setStorageSync('printer', { deviceId: deviceId, connected: true })
      getBLEDeviceServices(deviceId, page)
      wx.onBLEConnectionStateChange(res => {
        console.debug(`${res.deviceId} 状态已改变, 连接状态: ${res.connected}`)
        const result = wx.getStorageSync('printer')
        if (result.deviceId === res.deviceId && !res.connected) {
          Object.assign(result, { connected: false })
          wx.setStorageSync('printer', result)
        }
      })
      getBluetoothDevice(deviceId, page)
      wx.stopBluetoothDevicesDiscovery({
        complete(res) {
          console.debug('停止扫描蓝牙设备', res)
        }
      })
    },
    fail: res => {
      console.debug('连接蓝牙设备失败', res)
    }
  })
}

export const getBluetoothDevice = (deviceId, page) => {
  wx.getBluetoothDevices({
    success: res => {
      console.debug('获取在蓝牙模块生效期间所有搜索到的蓝牙设备', res)
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
