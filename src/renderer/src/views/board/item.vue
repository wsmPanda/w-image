<template>
  <div ref="item" class="board-item" :style="itemStyle">
    <!-- <div class="board-item-clip" :style="itemClipStyle(item)"></div> -->
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

const itemStyle = computed(() => {
  const { data } = props
  const style = {
    width: data.width + "px",
    height: data.height + "px",
    top: data.top + "px",
    left: data.left + "px",
    zIndex: data.zIndex || 0,
    transfrom: `rotate(${data.rotate || 0}deg)`,
    backgroundImage: `url(image://${data.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `100% 100%`
  }
  return style
})
const itemClipStyle = computed(() => {
  const { data } = props
  const style = {
    width: data.clipWidth + "px",
    height: data.clipHeight + "px",
    top: data.clipTop + "px",
    left: data.clipleft + "px",
    zIndex: (data.zIndex || 0) + 1,
    backgroundImage: `url(image://${data.src})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: `-${data.clipWidth}px -${data.width}px`,
    backgroundSize: `${data.width}px ${data.height}px`
  }
  return style
})
</script>
