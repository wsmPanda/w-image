<template>
  <div ref="item" class="board-item" :style="itemStyle">
    <div class="board-item-background" :style="backgroundStyle"></div>
    <div class="board-item-clip" :style="itemClipStyle"></div>
  </div>
</template>
<script setup>
import { computed } from "vue"
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const backgroundStyle = computed(() => {
  const { data } = props
  const style = {
    backgroundImage: `url(image://${data.src})`
  }
  return style
})
const itemStyle = computed(() => {
  const { data } = props
  const style = {
    width: data.width + "px",
    height: data.height + "px",
    top: data.top + "px",
    left: data.left + "px",
    zIndex: data.zIndex || 0,
    transform: `rotate(${data.rotate || 0}deg)`
  }
  return style
})
const itemClipStyle = computed(() => {
  const { data } = props
  const style = {
    width: data.clipWidth + "px",
    height: data.clipHeight + "px",
    top: data.clipTop + "px",
    left: data.clipLeft + "px",
    zIndex: (data.zIndex || 0) + 1,
    backgroundImage: `url(image://${data.src})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `${-data.clipLeft}px ${-data.clipTop}px`,
    backgroundSize: `${data.width}px ${data.height}px`
  }
  return style
})
</script>
