let httpServer;

import { videoSupport } from "../../video/ffmpeg-helper";
import VideoServer from "../../video/VideoServer";

function onVideoFileSeleted(videoFilePath) {
  return videoSupport(videoFilePath)
    .then((checkResult) => {
      let playParams = {};
      // if (checkResult.videoCodecSupport && checkResult.audioCodecSupport) {
      //   if (httpServer) {
      //     httpServer.killFfmpegCommand();
      //   }
      //   playParams.type = "native";
      //   playParams.videoSource = videoFilePath;
      // }
      //if (!checkResult.videoCodecSupport || !checkResult.audioCodecSupport || 1) {
      if (!httpServer) {
        httpServer = new VideoServer();
      }
      httpServer.videoSourceInfo = {
        videoSourcePath: videoFilePath,
        checkResult: checkResult
      };
      httpServer.createServer();
      console.log("createVideoServer success");
      playParams.type = "stream";
      playParams.videoSource = "http://127.0.0.1:8888?startTime=0";
      playParams.duration = checkResult.duration;
      //}
      return playParams;
    })
    .catch((err) => {
      console.error(err);
      console.log("video format error");
    });
}

export default {
  video({ path }) {
    return onVideoFileSeleted(path);
  }
};
