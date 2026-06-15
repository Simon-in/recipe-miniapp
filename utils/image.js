const fs = wx.getFileSystemManager()

function isLocalImage(path) {
  if (!path) return false
  const userPath = wx.env.USER_DATA_PATH
  return path.startsWith(userPath) || path.startsWith('wxfile://usr')
}

function saveImageToLocal(tempPath) {
  return new Promise((resolve, reject) => {
    const extMatch = tempPath.match(/\.(\w+)(\?.*)?$/)
    const ext = extMatch ? extMatch[1] : 'jpg'
    const savedPath = `${wx.env.USER_DATA_PATH}/recipe-${Date.now()}.${ext}`

    fs.saveFile({
      tempFilePath: tempPath,
      filePath: savedPath,
      success: () => resolve(savedPath),
      fail: () => {
        fs.copyFile({
          srcPath: tempPath,
          destPath: savedPath,
          success: () => resolve(savedPath),
          fail: reject
        })
      }
    })
  })
}

function chooseCoverImage() {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: async (res) => {
        try {
          const tempPath = res.tempFiles[0].tempFilePath
          const savedPath = await saveImageToLocal(tempPath)
          resolve(savedPath)
        } catch (err) {
          reject(err)
        }
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) {
          resolve(null)
          return
        }
        reject(err)
      }
    })
  })
}

function deleteLocalImage(filePath) {
  if (!isLocalImage(filePath)) return Promise.resolve()
  return new Promise((resolve) => {
    fs.unlink({
      filePath,
      complete: resolve
    })
  })
}

function previewImage(url) {
  if (!url) return
  wx.previewImage({
    current: url,
    urls: [url]
  })
}

module.exports = {
  chooseCoverImage,
  deleteLocalImage,
  previewImage,
  isLocalImage
}
