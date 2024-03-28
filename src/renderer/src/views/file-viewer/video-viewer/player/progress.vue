<template>
  <div ref="progressEl" class="video-player-progress" @mousedown="onProgressMousedown">
    <div
      class="video-player-progress-inner"
      :style="{
        width: `${progress * 100}%`
      }"
    ></div>
    <div
      class="video-player-progress-bar"
      :style="{
        left: `${progress * 100}%`
      }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onUnmounted } from "vue"

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(["change"])
const progressEl = ref<HTMLElement>()
const draging = ref(false)
const onProgressMousedown = (e) => {
  setProgress(e.offsetX / progressEl.value!.offsetWidth)
  draging.value = true
}
const setProgress = (value) => {
  emit("change", value)
}
const onMouseup = () => {
  draging.value = false
}
const onMouseMove = (e: MouseEvent) => {
  if (draging.value) {
    const rect = progressEl.value!.getBoundingClientRect()
    let x = e.screenX - rect.x
    if (x < 0) x = 0
    if (x > rect.width) x = rect.width
    setProgress(x / rect.width)
  }
}

onUnmounted(() => {
  window.removeEventListener("mouseup", onMouseup)
  window.removeEventListener("mousemove", onMouseMove)
})

window.addEventListener("mouseup", onMouseup)
window.addEventListener("mousemove", onMouseMove)
</script>
<style lang="less" scoped>
.video-player-progress {
  height: 4px;
  cursor: pointer;
  background: #ddd;
  position: relative;
  .video-player-progress-inner {
    background: #eee;
    height: 100%;
  }
  .video-player-progress-bar {
    background: #ccc;
    position: absolute;
    height: 12px;
    width: 12px;
    border-radius: 6px;
    top: -3px;
    left: 0;
    pointer-events: none;
  }
  :hover {
  }
}
</style>
