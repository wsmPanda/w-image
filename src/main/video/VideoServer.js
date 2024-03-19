"use strict"
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path
const ffmpeg = require("fluent-ffmpeg")
const { exec } = require("child_process")

ffmpeg.setFfmpegPath(ffmpegPath)
const http = require("http")

function getParam(url, key) {
  var param = new Object()
  var item = new Array()
  var urlList = url.split("?")
  var req
  if (urlList.length == 1) {
    req = urlList[0]
  } else {
    req = urlList[1]
  }
  var list = req.split("&")
  for (var i = 0; i < list.length; i++) {
    item = list[i].split("=")
    param[item[0]] = item[1]
  }
  return param[key] ? param[key] : null
}

let hwaccel = null
async function getHwaccel() {
  if (hwaccel) return hwaccel
  return new Promise((resolve, reject) => {
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
      hwaccel = availableAccelerators.pop()
      resolve(hwaccel)
    })
  })
}

export default class VideoServer {
  constructor(props) {
    this._videoServer
    this._videoSourceInfo
    this._ffmpegCommand
  }

  set videoSourceInfo(info) {
    this._videoSourceInfo = info
  }

  get videoSourceInfo() {
    return this._videoSourceInfo
  }

  killFfmpegCommand() {
    if (this._ffmpegCommand) {
      this._ffmpegCommand.kill()
    }
  }

  createServer() {
    if (!this._videoServer && this.videoSourceInfo) {
      this._videoServer = http
        .createServer(async (request, response) => {
          console.log("on request", request.url)
          var startTime = parseInt(getParam(request.url, "startTime"))
          let videoCodec = this.videoSourceInfo.checkResult.videoCodecSupport ? "copy" : "libx264"
          let audioCodec = this.videoSourceInfo.checkResult.audioCodecSupport ? "copy" : "aac"
          this.killFfmpegCommand()
          const h = await getHwaccel()
          this._ffmpegCommand = ffmpeg()
            .input(this.videoSourceInfo.videoSourcePath)
            .nativeFramerate()
            .videoCodec(videoCodec)
            .audioCodec(audioCodec)
            .format("mp4")
            .seekInput(startTime)
            .outputOptions(
              "-movflags",
              "frag_keyframe+empty_moov+faststart",
              "-g",
              "18",
              //   "-b:v",
              //   "600k",
              "-preset",
              "ultrafast"
              //   "-c:v",
              //   "h264_" + h
            )
            // .on('progress', function (progress) {
            //     console.log('time: ' + progress.timemark);
            // })
            .on("error", function (err) {
              console.log("An error occurred: " + err.message)
            })
            .on("end", function () {
              console.log("Processing finished !")
            })
          let videoStream = this._ffmpegCommand.pipe()
          videoStream.pipe(response)
        })
        .listen(8888)
    }
  }
}
