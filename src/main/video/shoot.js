// 引入相关模块
const fs = require("fs")
const ffmpeg = require("fluent-ffmpeg")
const { createCanvas, loadImage } = require("canvas")

// 设置视频文件路径和截图数量
const videoPath = "video.mp4"
const screenshotCount = 4

// 创建一个画布
const canvasWidth = 800
const canvasHeight = 600
const canvas = createCanvas(canvasWidth, canvasHeight)
const ctx = canvas.getContext("2d")

// 获取视频的元数据
ffmpeg.ffprobe(videoPath, (err, metadata) => {
  if (err) {
    console.error(err)
    return
  }
  // 获取视频的时长和帧率
  const duration = metadata.format.duration
  const fps = metadata.streams[0].avg_frame_rate

  // 计算每个截图的时间点和间隔
  const interval = duration / (screenshotCount + 1)
  const timestamps = []
  for (let i = 0; i < screenshotCount; i++) {
    timestamps.push((i + 1) * interval)
  }

  // 生成截图并保存为图片文件
  ffmpeg(videoPath)
    .on("filenames", (filenames) => {
      console.log("生成截图文件名：", filenames)
    })
    .on("end", async () => {
      console.log("生成截图完成")
      // 加载每个截图文件并绘制到画布上
      const imageWidth = canvasWidth / 2
      const imageHeight = canvasHeight / 2
      for (let i = 0; i < screenshotCount; i++) {
        const image = await loadImage(`screenshots/${i}.png`)
        const x = (i % 2) * imageWidth
        const y = Math.floor(i / 2) * imageHeight
        ctx.drawImage(image, x, y, imageWidth, imageHeight)
      }
      // 将画布保存为图片文件
      const out = fs.createWriteStream("output.png")
      const stream = canvas.createPNGStream()
      stream.pipe(out)
      out.on("finish", () => {
        console.log("生成多格截图完成")
      })
    })
    .on("error", (err) => {
      console.error(err)
    })
    .screenshots({
      timestamps,
      filename: "%i.png",
      folder: "screenshots",
      size: "?x480"
    })
})
