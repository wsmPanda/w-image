import { path as appPath } from "../db/util"
import { selectTable } from "../db"

const fs = require("fs")
const path = require("path")
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path
const ffprobePath = require("@ffprobe-installer/ffprobe").path
const ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)
import { v4 } from "uuid"
export const screenshotCount = 8

const generateVideoMap = new Map()

export const getVideoShoots = async (videoPath) => {
  const uuidMap = await selectTable("video_screenshot_map").get()
  if (uuidMap[videoPath] || 0) {
    return uuidMap[videoPath]
  } else {
    return generateVideoShoot(videoPath)
  }
}

export const getVideoShootsList = async (videoPath) => {
  const uuid = await getVideoShoots(videoPath)
  const res = []
  for (let i = 0; i < screenshotCount; i++) {
    res.push(path.join(appPath("screenshots"), `${uuid}_${i + 1}.jpg`))
  }
  return res
}

export const generateVideoShoot = (p) => {
  if (generateVideoMap.get(p)) {
    return generateVideoMap.get(p)
  }
  console.log(`====== start generateVideoShoot ${p} ======`)
  const promise = new Promise(async (resolve, reject) => {
    // time ffmpeg -ss 00:02:06 -i test1.flv -f image2 -y test1.jpg
    // 设置视频文件路径和截图数量
    const videoPath = p
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
      console.log(appPath("screenshots"))
      const uuid = v4()
      // 生成截图并保存为图片文件
      const startTime = +new Date()
      try {
        ffmpeg(videoPath)
          .inputOptions(["-hwaccel cuda", "-threads 4"])
          .on("filenames", (filenames) => {
            selectTable("video_screenshot_map").merge({
              [p]: uuid
            })
            console.log("生成截图中")
          })
          .on("end", async () => {
            console.log("生成截图完成:" + (+new Date() - startTime) / 1000 + "s")
            resolve(uuid)
          })
          .on("error", (err) => {
            console.log("3生成截图错误")
            console.error(err)
            reject(err)
          })
          .screenshots({
            config: {
              fastSeek: true
            },
            timestamps,
            filename: uuid + "_" + "%i.jpg",
            folder: appPath("screenshots"),
            size: "?x240",
            // 调整截图质量
            additional: ["-q:v", "2"],
            // 使用硬件加速（如果支持）
            encoder: "h264_nvenc"
          })
      } catch (ex) {
        console.error(ex)
        reject(ex)
      }
    })
  })
  generateVideoMap.set(p, promise)
  return promise
}
