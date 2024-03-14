import { path as appPath } from "../db/util"
import { JsonDataTable } from "../db"
const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path
const ffprobePath = require("@ffprobe-installer/ffprobe").path
const ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)
import { v4 } from "uuid"
export const screenshotCount = 10

const generateVideoMap = new Map()
const screenshotTable = new JsonDataTable("video_screenshot_map")

export const getVideoShoots = async (videoPath) => {
  const uuidMap = await screenshotTable.get()
  if (uuidMap[videoPath]) {
    return uuidMap[videoPath]
  } else {
    return generateVideoShoot(videoPath).then((uuid) => {
      screenshotTable.merge({
        [videoPath]: uuid
      })
      return uuid
    })
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

export const getFilesVideoShoots = async (list) => {
  const uuidMap = await screenshotTable.get()
  for (let item of list) {
    try {
      console.log(`(${list.indexOf(item)}/${list.length})${item}`)
      if (!uuidMap[item]) {
        const uuid = await generateVideoShoot(item)
        uuidMap[item] = uuid
      }
    } catch (ex) {
      console.error(ex)
    }
  }
  await screenshotTable.merge(uuidMap)
  console.log("getFilesVideoShoots done")
}

export const generateVideoShoot = (p) => {
  if (generateVideoMap.get(p)) {
    return generateVideoMap.get(p)
  }
  console.log(`====== start generateVideoShoot ${p} ======`)
  const promise = new Promise(async (resolve, reject) => {
    // 设置视频文件路径和截图数量
    const videoPath = p
    // 获取视频的元数据
    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        console.error(err)
        return
      }
      // 获取视频的时长和帧率
      const duration = metadata.format.duration
      // const fps = metadata.streams[0].avg_frame_rate
      // 计算每个截图的时间点和间隔
      const interval = duration / (screenshotCount + 1)
      const timestamps = []
      for (let i = 0; i < screenshotCount; i++) {
        timestamps.push((i + 1) * interval)
      }
      const uuid = v4()
      // 生成截图并保存为图片文件
      const startTime = +new Date()
      const shootingList = []
      for (let i = 0; i < screenshotCount; i++) {
        shootingList.push(() =>
          getOneShoot(videoPath, path.join(appPath("screenshots"), uuid), duration, i)
        )
      }
      await parallRun(shootingList, 4)
      console.log("生成截图完成:" + (+new Date() - startTime) / 1000 + "s")
      resolve(uuid)
      return uuid
    })
  })
  generateVideoMap.set(p, promise)
  return promise
}

export function getShootsOld(videoPath, uuid) {
  return new Promise((resolve, reject) => {
    try {
      ffmpeg(videoPath)
        // .inputOptions(["-hwaccel cuda", "-threads 4"])
        .inputOptions(["-hwaccel", "videotoolbox"])
        .on("filenames", () => {
          console.log("生成截图中")
        })
        .on("end", async () => {
          screenshotTable.merge({
            [p]: uuid
          })
          console.log("生成截图完成:" + (+new Date() - startTime) / 1000 + "s")
          resolve(uuid)
        })
        .on("error", (err) => {
          console.log("生成截图错误")
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
}

export function getOneShoot(videoPath, shootPath, duration, i) {
  return new Promise((resolve, reject) => {
    let time = (duration / (screenshotCount - 1)) * i
    if (time >= duration) {
      time = duration - 0.1
    }
    if (time < 0) {
      time = 0
    }
    let command = `"${ffmpegPath}" -ss ${time} -i "${videoPath}" -f image2 -vframes 1 -y "${shootPath}_${
      i + 1
    }.jpg"`
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        reject(error)
        return
      }
      resolve()
    })
  })
}

function parallRun(list, maxLength) {
  return new Promise((resolve, reject) => {
    let resultList = []
    let nextIndex = 0
    let resultCount = 0
    let runningCount = 0
    const run = (index) => {
      runningCount++
      nextIndex++
      list[index]()
        .then((res) => {
          resultList[index] = res
        })
        .catch((ex) => {
          resultList[index] = ex
        })
        .finally(() => {
          resultCount++
          if (resultCount >= list.length) {
            resolve(resultList)
          }
          runningCount--
          if (runningCount < maxLength && nextIndex < list.length) {
            run(nextIndex)
          }
        })
    }
    for (let i = 0; i < maxLength; i++) {
      run(i)
    }
  })
}
