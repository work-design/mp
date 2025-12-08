
Page({
  onLoad(query) {

    wx.downloadFile({
      url: decodeURIComponent(query.url),
      success: res => {
        res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success'
            })
          }
        })
      }
    })
  }

})