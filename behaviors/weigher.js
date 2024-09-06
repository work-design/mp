export const weigher = Behavior({
  observers: {
    'buffer': function(buffer) {

      const arr = Array(36).fill('0000000 g')

      const result = buffer.match(/.{1,2}/g).map(i => String.fromCharCode(parseInt(i, 16)))
      const weight = `${result.slice(1, 8).join('')}${result.slice(15, 17).join('')}`
      arr.push(weight)
      arr.shift()

      console.debug('---------in be', weight, this)

      this.setData({ origin_value: weight })
      if (weight && arr.every(el => el === weight)) {
        this.setData({ value: weight })
      }
    }
  }
})
