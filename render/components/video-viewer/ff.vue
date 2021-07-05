<template>
  <div class="video-viewer">
    <Button @click="snap">截图(F3)</Button>
    <canvas v-show="canvasShow" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  inject: ["$main"],
  props: {
    data: {}
  },
  data() {
    return {
      videoReady: false,
      videoSource: null,
      playerOptions: {
        sources: [
          {
            type: "video/mp4",
            src: "file://" + this.data
          }
        ]
      },
      canvasShow: false,
      videoWidth: 0,
      videoHeight: 0
    };
  },
  methods: {
    snap() {
      let canvas = this.$refs.canvas;
      let video = this.$refs.video;
      this.ratio = video.videoWidth / video.videoHeight;
      this.videoWidth = video.videoWidth - 100;
      this.videoHeight = parseInt(this.videoWidth / this.ratio, 10);
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      let context = canvas.getContext("2d");
      context.fillRect(0, 0, this.videoWidth, this.videoHeight);
      context.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);
      canvas.toBlob(blob => {
        let reader = new FileReader();
        reader.onload = () => {
          let buffer = new Buffer(reader.result);
          this.$connect.run("saveBlob", {
            file: buffer,
            time: video.currentTime,
            name: this.data
              .split(/\/|\\/)
              .pop()
              .split(".")
              .shift()
          });
        };
        reader.onerror = err => console.error(err);
        reader.readAsArrayBuffer(blob);
        this.$Message.success("截图成功");
      });
    },
    onVolumechange() {
      this.$set(this.$main.storage, "videoVolume", this.$refs.video.volume);
      this.$set(this.$main.storage, "videoMuted", this.$refs.video.muted);
    }
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onSnap);
  },
  mounted() {
    // this.$refs.video.volume = this.$main.storage.videoVolume || 0;
    this.onSnap = e => {
      if (e.code === "F3") {
        this.snap();
      }
    };
    window.addEventListener("keyup", this.onSnap);
  },
  created() {
    this.$connect
      .run("video", {
        path: this.data
      })
      .then(message => {
        if (!message) {
          return;
        }
        this.videoSource = message.videoSource;
        this.playerOptions = {
          techOrder: ["StreamPlay"],
          StreamPlay: { duration: message.duration },
          sources: [
            {
              type: "video/mp4",
              src: message.videoSource
            }
          ]
        };
        this.videoReady = true;
        setTimeout(() => {
          if (this.$main.config.video.autoPlay) {
            this.$refs.video.player.play();
          }
        });
      });
  }
};
</script>

<style lang="less">
.video-viewer {
  .video {
    width: 100%;
    margin-bottom: 38px;
  }
  .video-js .vjs-control-bar {
    display: flex;
    margin-bottom: -32px;
  }
}
</style>
