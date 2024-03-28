<template>
  <div class="video-player">
    <video
      ref="video"
      controls="false"
      @canplay="onCanPlay"
      @loadedmetadata="onLoadedmetadata"
      @timeupdate="handleTimeUpdate"
      @wheel="onWheel"
      :muted="$main.storage.videoMuted"
      :autoplay="$main.config.video.autoPlay"
      :src="videoSrc"
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>
    <div class="video-player-control">
      <Progress :progress="progress" @change="onProgressChange"></Progress>
      <div>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>

      <div class="video-player-config">
        <div class="video-player-config"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, computed } from "vue"
import Progress from "./progress.vue"

const $main = inject("$main") as any

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const video = ref<HTMLVideoElement | null>(null)
const videoSrc = ref()
const duration = ref(0)
const currentTime = ref(0)
const startTime = ref(0)
const progress = computed(() => {
  return (currentTime.value || 0) / duration.value || 0
})

const isFF = computed(() => {
  return ($main.config && $main.config.video && $main.config.video.player) === "ff"
})

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time / 60) % 60)
  const seconds = Math.floor(time % 60)
  let res = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  if (hours) {
    res = `${hours}:res`
  }
  return res
}

const onCanPlay = () => {}
const onLoadedmetadata = () => {
  if (video.value && !isFF.value) {
    duration.value = video.value!.duration
  }
}
const handleTimeUpdate = () => {
  currentTime.value = video.value!.currentTime + startTime.value
}
const onProgressChange = (v) => {
  if (isFF.value) {
    startTime.value = duration.value * v
    updateSrc()
  } else {
    video.value!.currentTime = v * duration.value
  }
}
const onWheel = (e) => {
  if ($main.config?.video?.wheelScroll) {
    onProgressChange(progress.value + e.deltaY * 0.00015)
    e.preventDefault()
    e.stopPropagation()
  }
}
const updateSrc = () => {
  videoSrc.value = `http://127.0.0.1:8888/video?video=${encodeURIComponent(
    props.src.replace(/\\/g, "/")
  )}&startTime=${startTime.value}`
}
onMounted(() => {
  if (video.value) {
    // video.value!.controls = false
  }
})
if (isFF.value) {
  window
    .ConnectRun("video", {
      path: props.src
    })
    .then((res) => {
      duration.value = res.duration
      updateSrc()
    })
} else {
  videoSrc.value = "file://" + props.src
}
</script>
<style lang="less" scoped>
.video-player {
  position: relative;
  user-select: none;
}
video {
  width: 100%;
}
.video-player-control {
  padding: 4px;
}
</style>
