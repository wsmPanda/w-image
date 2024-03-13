const { exec } = require("child_process")
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path.replace("app.asar", "app.asar.unpacked")
// 执行 ffmpeg 命令以列出可用的硬件加速器
exec(ffmpegPath + " -hwaccels", (error, stdout, stderr) => {
  if (error) {
    console.error(`执行 ffmpeg 时出错：${error.message}`)
    return
  }

  const availableAccelerators = stdout.split("\n").filter((line) => line.trim() !== "")
  console.log("可用的硬件加速器选项：")
  availableAccelerators.forEach((accelerator, index) => {
    console.log(`${index + 1}. ${accelerator}`)
  })
})

export function getOneShoot(videoPath, shootPath, duration, fps) {
  return new Promise((resolve, reject) => {
    const shootConfig = {
      count: 5
    }
    /* 
     一次生成多张
ffmpeg -ss 100 -t 600 -r 0.2 -i 1.mp4 -f image2 -vframes 5 -y %03d.jpg
-ss 100：从视频的第100秒开始处理。
-t 600：处理接下来的600秒（即从第100秒开始，到第700秒结束）。
-r 0.2：以每秒0.2帧的速度截取图片，这意味着每5秒截取一帧。
-i 1.mp4：指定输入文件为1.mp4。
-f image2：指定输出格式为image2，这是FFmpeg用于截图的一种格式。
-vframes 5：总共截取5帧图片。
-y：覆盖已存在的输出文件。
%03d.jpg：输出文件的命名格式，%03d表示数字部分会用三位数表示，不足部分用0填充。例如，第一张图片的文件名将是001.jpg。
综上所述，这段命令将从视频的第100秒开始，每5秒截取一帧，总共截取5帧，生成的图片文件名从001.jpg到005.jpg。这些图片将覆盖任何同名的已存在文件。如果您有其他问题或需要进一步的帮助，请告诉我！ 😊
 */
    let command = `"${ffmpegPath}" -ss 0 -t ${duration} -i "${videoPath}" -f image2 -r ${
      1 / (duration / (shootConfig.count - 2))
    } -vframes ${shootConfig.count} -y "${shootPath}_%d.jpg"`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行 ffmpeg 时出错：${error.message}`)
        reject(error)
        return
      }
      resolve()
      //console.log(stdout)
      console.log("Shoot Success:" + shootPath)
    })
  })
}
