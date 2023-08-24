export async function getImgWidthHeight(src, maxWaitLoad = 2500) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = "file://" + src
    if (img.complete) {
      const { width, height } = img
      resolve({ width, height })
    } else {
      let timeOut = setTimeout(() => {
        reject("图片加载失败！")
      }, maxWaitLoad)
      img.onload = function () {
        const { width, height } = img
        window.clearTimeout(timeOut)
        resolve({ width, height })
      }
    }
  })
}
