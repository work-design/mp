Component({
  observers: {
    'numberA, numberB': (numberA, numberB) => {



      this.setData({
        sum: numberA + numberB
      })
    }
  }
})
