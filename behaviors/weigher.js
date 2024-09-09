export const weigher = Behavior({
  data: {
    arr: Array(36).fill('0000000 g')
  },
  observers: {
    'buffer': function(buffer) {
      const result = buffer.match(/.{1,2}/g).map(i => String.fromCharCode(parseInt(i, 16)))
      const weight = `${result.slice(1, 8).join('')}${result.slice(15, 17).join('')}`
      this.data.arr.push(weight)
      this.data.arr.shift()

      console.debug('---------in be', weight, this.data.arr)

      this.setData({ origin_value: weight })
      if (weight && this.data.arr.every(el => el === weight)) {
        this.setData({ value: weight })
      }
    }
  }
})
