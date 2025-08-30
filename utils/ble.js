const HOST = wx.getExtConfigSync().host

// setData
// devices
// printer
export default class BluetoothPrinter {

  constructor() {
    this.devices = []
    this.chs = []
    this.registeredDevices = []
    this.printer = {}
  }

  // 获取本机蓝牙适配器状态
  getState(callback = () => {}) {
    wx.getBluetoothAdapterState({
      success: stateRes => {
        console.debug('获取本机蓝牙适配器状态', stateRes.adapterState)
        const state = stateRes.adapterState || stateRes

        if (!state.discovering) {
          this.startBluetoothDevicesDiscovery()
        }

        if (state.available) {
          wx.getBluetoothDevices({
            success: res => {
              console.debug('获取在蓝牙模块生效期间所有搜索到的蓝牙设备', res)
              this.filterBluetoothDevices(res.devices)
            }
          })
          wx.onBluetoothDeviceFound(res => {
            console.debug('发现新设备', res)
            this.filterBluetoothDevices(res.devices)
          })
        }
      },
      fail: stateRes => {
        console.debug('获取本机蓝牙适配器状态失败', stateRes)
        wx.openBluetoothAdapter({
          success: res => {
            console.debug('初始化蓝牙模块', res)
            this.startBluetoothDevicesDiscovery()
            wx.onBluetoothDeviceFound(res => {
              console.debug('发现新设备', JSON.stringify(res.devices))
              this.filterBluetoothDevices(res.devices)
            })
          },
          fail: res => {
            callback(res)
            console.debug('初始化蓝牙模块失败', res)
          }
        })
      }
    })
  }

  startBluetoothDevicesDiscovery() {
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: res => {
        console.debug('开始搜寻附近的蓝牙设备', res)
      },
      fail: res => {
        console.debug('搜寻附近的蓝牙设备失败', res)
      }
    })
  }

  restartBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      success: res => {
        console.debug('停止蓝牙扫描', res)
        this.startBluetoothDevicesDiscovery()
      }
    })
  }

  filterBluetoothDevices(devices) {
    const foundDevices = this.devices

    devices.forEach(device => {
      if (!device.name && !device.localName) { return }
      if (!device.RSSI) { return }
      if (device.name.includes('未知或不支持的设备') || device.name.includes('未知设备')) { return }
      const item = foundDevices.find(e => e.deviceId === device.deviceId)
      if (item) {
        Object.assign(item, device)
      } else {
        console.debug('搜索到新设备', device.name)
        foundDevices.push(device)
      }
    })

    const item = foundDevices.find(e => this.registeredDevices.includes(e.name))
    if (item && this.printer.deviceId !== item.deviceId) {
      console.debug('可连接设备', item)
      foundDevices.sort((a, b) => {
        if (a.deviceId === item.deviceId) {
          return -1
        } else if (b.deviceId === item.deviceId) {
          return 1
        }

        return 0
      })
      wx.offBluetoothDeviceFound(res => {
        console.debug('停止监听', res)
      })
      wx.stopBluetoothDevicesDiscovery({
        complete(res) {
          console.debug('停止扫描蓝牙设备', res)
        }
      })
      this.createBLEConnection(item.deviceId)
    }

    this.devices = foundDevices
  }

  // 获取蓝牙设备服务中所有特征
  getBLEDeviceCharacteristics(deviceId, serviceId) {
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
                console.debug('读取蓝牙设备特征值的二进制数据', item.uuid, res)
              }
            })
          }
          if (item.properties.write && item.properties.writeNoResponse) {
            console.debug('可写入', item.uuid, item)
            this.printer = {
              deviceId: deviceId,
              serviceId: serviceId,
              characteristicId: item.uuid
            }
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
  #onBLECharacteristicValueChange() {
    wx.onBLECharacteristicValueChange(characteristic => {
      const foundChs = this.chs
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

      this.chs = foundChs
    })
  }

  // 向蓝牙设备发送数据
  writeValue(data, maxChunk = 20) {
    while (data.length > 0) {
      let subData = data.splice(0, maxChunk)
      let buffer = new ArrayBuffer(subData.length)
      let uint = new Uint8Array(buffer)
      uint.set(subData)

      wx.writeBLECharacteristicValue({
        deviceId: this.printer.deviceId,
        serviceId: this.printer.serviceId,
        characteristicId: this.printer.characteristicId,
        value: buffer,
        writeType: 'write',
        success(res) {
          console.debug('写入数据成功', res.errMsg)
        },
        fail(res) {
          console.debug('写入数据失败', res)
        }
      })
    }
  }

  createBLEConnection(deviceId) {
    wx.createBLEConnection({
      deviceId,
      success: res => {
        console.debug('连接蓝牙设备', deviceId, res)
        this.printer = { deviceId: deviceId }

        // 获取蓝牙设备的所有服务
        wx.getBLEDeviceServices({
          deviceId,
          success: res => {
            for (const item of res.services) {
              if (item.isPrimary) {
                console.debug('设备 ID：', deviceId, '主服务：', item.uuid)
                this.getBLEDeviceCharacteristics(deviceId, item.uuid)
                this.#onBLECharacteristicValueChange()
              }
            }
          }
        })
      },
      fail: res => {
        console.debug('连接蓝牙设备失败', res)
      }
    })
  }

}
