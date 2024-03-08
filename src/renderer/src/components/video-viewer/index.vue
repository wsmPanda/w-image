<template>
  <div>
    <video
      ref="video"
      class="video"
      controls="1"
      :muted="$main.storage.videoMuted"
      :autoplay="$main.config.video.autoPlay"
      @volumechange="onVolumechange"
    >
      <source :src="'file://' + data" type="video/mp4" />
    </video>
    <Button @click="snap">截图(F3)</Button>
    <Button @click="test">test</Button>
    <div v-if="shootsList.length" class="video-shoot-box">
      <div
        class="video-shoot-item"
        v-for="(item, index) in shootsList"
        :key="item"
        @click="onShootClick(index)"
      >
        <img :src="'file://' + item" alt="" />
      </div>
    </div>
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
      canvasShow: false,
      videoWidth: 0,
      videoHeight: 0,
      shootsList: []
    }
  },
  computed: {
    videoType() {
      return `video/${this.data.split(".").pop()}`
    }
  },
  methods: {
    snap() {
      let canvas = this.$refs.canvas
      let video = this.$refs.video
      this.ratio = video.videoWidth / video.videoHeight
      this.videoWidth = video.videoWidth - 100
      this.videoHeight = parseInt(this.videoWidth / this.ratio, 10)
      canvas.width = this.videoWidth
      canvas.height = this.videoHeight
      let context = canvas.getContext("2d")
      context.fillRect(0, 0, this.videoWidth, this.videoHeight)
      context.drawImage(video, 0, 0, this.videoWidth, this.videoHeight)
      canvas.toBlob((blob) => {
        let reader = new FileReader()
        reader.onload = () => {
          let buffer = new Buffer(reader.result)
          window.ConnectRun("saveBlob", {
            file: buffer,
            time: video.currentTime,
            name: this.data.split(/\/|\\/).pop().split(".").shift()
          })
        }
        reader.onerror = (err) => console.error(err)
        reader.readAsArrayBuffer(blob)
        this.$Message.success("截图成功")
      })
    },
    onVolumechange() {
      this.$set(this.$main.storage, "videoVolume", this.$refs.video.volume)
      this.$set(this.$main.storage, "videoMuted", this.$refs.video.muted)
    },
    onShootClick(index) {
      this.$refs.video.currentTime = (this.$refs.video.duration * index) / this.shootsList.length
    }
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onSnap)
  },
  mounted() {
    this.$refs.video.volume = this.$main.storage.videoVolume || 0
    this.onSnap = (e) => {
      if (e.code === "F3") {
        this.snap()
      }
    }
    window.addEventListener("keyup", this.onSnap)
  },
  async created() {
    this.shootsList = await window.ConnectRun("getVideoShootsList", { path: this.data })
  }
}
</script>

<style lang="less">
.video {
  width: 100%;
  max-height: 100%;
}
.video-shoot-box {
  display: flex;
  flex-wrap: wrap;
}
.video-shoot-item {
  width: 50%;
  overflow: hidden;
  img {
    max-width: 100%;
    object-fit: contain;
  }
}
</style>
