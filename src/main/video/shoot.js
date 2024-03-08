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
export const screenshotCount = 4

const generateVideoMap = new WeakMap()

export const getVideoShoots = async (videoPath) => {
  const uuidMap = await selectTable("video_screenshot_map").get()
  if (uuidMap[videoPath]) {
    return uuidMap[videoPath]
  } else {
    return generateVideoShoot(videoPath)
  }
}

export const getVideoShootsList = async (videoPath) => {
  const uuid = await getVideoShoots(videoPath)
  const res = []
  for (let i = 0; i < screenshotCount; i++) {
    res.push(path.join(appPath("screenshots"), `${uuid}_${i + 1}.png`))
  }
  return res
}

export const generateVideoShoot = (p) => {
  if (generateVideoMap.get(p)) {
    return generateVideoMap.get(p)
  }
  const pormise = new Promise(async (resolve, reject) => {
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
      console.log(duration)
      // 计算每个截图的时间点和间隔
      const interval = duration / (screenshotCount + 1)
      const timestamps = []
      for (let i = 0; i < screenshotCount; i++) {
        timestamps.push((i + 1) * interval)
      }
      console.log(appPath("screenshots"))
      const uuid = v4()
      // 生成截图并保存为图片文件
      ffmpeg(videoPath)
        .on("filenames", (filenames) => {
          selectTable("video_screenshot_map").merge({
            [p]: uuid
          })
          console.log("生成截图文件名：", filenames)
        })
        .on("end", async () => {
          console.log("生成截图完成")
          resolve(uuid)
        })
        .on("error", (err) => {
          console.error(err)
          reject(error)
        })
        .screenshots({
          timestamps,
          filename: uuid + "_" + "%i.png",
          folder: appPath("screenshots"),
          size: "?x480"
        })
    })
  })
  generateVideoMap.get(p, pormise)
  return pormise
}
