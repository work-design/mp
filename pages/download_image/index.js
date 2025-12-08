
Page({
  onLoad(query) {
    console.debug('Download Image Onload:', query)
    wx.downloadFile({
      url: decodeURIComponent(query.url),
      success: res => {
        console.debug('临时文件路径：', res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success'
            })
            wx.navigateBack()
          },
          fail: (res) => {
            console.debug(res)
          }
        })
      }
    })
  }

})