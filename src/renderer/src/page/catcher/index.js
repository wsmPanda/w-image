const { app, nativeImage } = require("electron")

let webview

app.whenReady().then(() => {
  // 获取webview元素
  webview = document.getElementById("webview")

  // 等待webview加载完成
  webview.addEventListener("did-finish-load", () => {
    // 获取webview的webContents对象
    const webContents = webview.getWebContents()

    // 获取webRequest对象
    const webRequest = webContents.session.webRequest

    // 拦截图片的网络请求
    webRequest.onBeforeRequest({ urls: ["*://*.png", "*://*.jpg"] }, (details, callback) => {
      // 获取图片的数据
      const data = details.uploadData[0].bytes

      // 创建图片对象
      const image = nativeImage.createFromBuffer(data)

      // 将图片保存到指定目录中
      const filePath = app.getPath("pictures") + "/image.png"
      require("fs").writeFile(filePath, image.toPNG(), (err) => {
        if (err) throw err
        console.log("图片已保存")
      })

      // 允许请求继续
      callback({ cancel: false })
    })
  })
})
