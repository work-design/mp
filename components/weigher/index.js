Component({
  observers: {
    'chs': (buffer) => {

      const arr = Array(36).fill('0000000 g')

      const result = buffer.match(/.{1,2}/g).map(i => String.fromCharCode(parseInt(i, 16)))
      const weight = `${result.slice(1, 8).join('')}${result.slice(15, 17).join('')}`
      arr.push(weight)
      arr.shift()

      if (weight && arr.every(el => el === weight)) {
        this.setData({ value: weight })
      }

      this.setData({
        sum: numberA + numberB
      })
    }
  }
})
