<template>
  <div
    v-show="activeItem"
    ref="el"
    class="board-item-controller"
    :style="ControllerStyle"
    @mousedown="onControllerMouseDown"
    @mousedown.capture="onControllerDown"
  >
    <div class="board-item-controller-clip" :style="ControllerClipStyle">
      <div
        class="controller-clip controller-left"
        @mousedown.stop="onControllerClipDown(1, 0)"
      ></div>
      <div
        class="controller-clip controller-right"
        @mousedown.stop="onControllerClipDown(-1, 0)"
      ></div>
      <div
        class="controller-clip controller-top"
        @mousedown.stop="onControllerClipDown(0, 1)"
      ></div>
      <div
        class="controller-clip controller-bottom"
        @mousedown.stop="onControllerClipDown(0, -1)"
      ></div>
    </div>
    <div
      class="controller-size controller-top-left"
      @mousedown.stop="onControllerSizeDown(1, 1)"
    ></div>
    <div
      class="controller-size controller-top-right"
      @mousedown.stop="onControllerSizeDown(-1, 1)"
    ></div>
    <div
      class="controller-size controller-bottom-left"
      @mousedown.stop="onControllerSizeDown(1, -1)"
    ></div>
    <div
      class="controller-size controller-bottom-right"
      @mousedown.stop="onControllerSizeDown(-1, -1)"
    ></div>

    <div
      class="controller-rotate controller-top-left"
      @mousedown.stop="onControllerRotatDown(1, 1)"
    ></div>
    <div
      class="controller-rotate controller-top-right"
      @mousedown.stop="onControllerRotatDown(-1, 1)"
    ></div>
    <div
      class="controller-rotate controller-bottom-left"
      @mousedown.stop="onControllerRotatDown(1, -1)"
    ></div>
    <div
      ref="bottomEl"
      class="controller-rotate controller-bottom-right"
      @mousedown.stop="onControllerRotatDown(-1, -1)"
    ></div>
  </div>
</template>
<script setup>
import { inject, ref, watch, computed, onMounted, onUnmounted } from "vue"
import { useBoard } from "./useBoard.ts"

const { activeItem, boardSetting } = useBoard()
const bottomEl = ref()
const ControllerStyle = computed(() => {
  const data = activeItem.value || {}
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
const ControllerClipStyle = computed(() => {
  const data = activeItem.value || {}
  const style = {
    width: data.clipWidth + "px",
    height: data.clipHeight + "px",
    top: data.clipTop + "px",
    left: data.clipLeft + "px",
    zIndex: (data.zIndex || 0) + 1,
    backgroundPosition: `-${data.clipWidth}px -${data.width}px`,
    backgroundSize: `${data.width}px ${data.height}px`
  }
  return style
})

const startX = ref(0)
const startY = ref(0)
const moving = ref(false)
const rotating = ref(false)
const rotatingX = ref(0)
const rotatingY = ref(0)
const sizing = ref(false)
const sizingX = ref(0)
const sizingY = ref(0)
const cliping = ref(false)
const clipingX = ref(0)
const clipingY = ref(0)
const startItem = ref({})
const onControllerDown = (e) => {
  startX.value = e.clientX
  startY.value = e.clientY
  startItem.value = { ...activeItem.value }
}
const onControllerMouseDown = (e) => {
  moving.value = true
  window.addEventListener("mousemove", onControllerMouseMove)
  window.addEventListener("mouseup", onControllerMouseUp)
}
const onControllerSizeDown = (x, y) => {
  sizing.value = true
  sizingX.value = x
  sizingY.value = y
  window.addEventListener("mousemove", onControllerSizeMove)
  window.addEventListener("mouseup", onControllerMouseUp)
}
const onControllerClipDown = (x, y) => {
  cliping.value = true
  clipingX.value = x
  clipingY.value = y
  window.addEventListener("mousemove", onControllerClipMove)
  window.addEventListener("mouseup", onControllerMouseUp)
}
const onControllerClipMove = (e) => {
  if (activeItem.value) {
    if (clipingX.value > 0) {
      activeItem.value.clipLeft += e.movementX * clipingX.value
    }
    activeItem.value.clipWidth -= e.movementX * clipingX.value

    if (activeItem.value.clipLeft < 0) {
      activeItem.value.left += activeItem.value.clipLeft
      activeItem.value.width -= activeItem.value.clipLeft
      activeItem.value.clipLeft = 0
    }
    if (activeItem.value.clipLeft + activeItem.value.clipWidth > activeItem.value.width) {
      let detla = activeItem.value.clipLeft + activeItem.value.clipWidth - activeItem.value.width
      activeItem.value.width += detla
    }

    if (clipingY.value > 0) {
      activeItem.value.clipTop += e.movementY * clipingY.value
    }
    activeItem.value.clipHeight -= e.movementY * clipingY.value

    if (activeItem.value.clipTop < 0) {
      activeItem.value.top += activeItem.value.clipTop
      activeItem.value.height -= activeItem.value.clipTop
      activeItem.value.clipTop = 0
    }
    if (activeItem.value.clipTop + activeItem.value.clipHeight > activeItem.value.height) {
      let detla = activeItem.value.clipTop + activeItem.value.clipHeight - activeItem.value.height
      activeItem.value.height += detla
    }
  }
}
const onControllerSizeMove = (e) => {
  if (activeItem.value) {
    let width = activeItem.value.width
    let height = activeItem.value.height
    if (sizingX.value > 0) {
      activeItem.value.left += e.movementX
      activeItem.value.width -= e.movementX
    } else {
      activeItem.value.width += e.movementX
    }
    if (sizingY.value > 0) {
      activeItem.value.top += e.movementY
      activeItem.value.height -= e.movementY
    } else {
      activeItem.value.height += e.movementY
    }

    if (boardSetting.value.lockRatio) {
      if (
        activeItem.value.width / activeItem.value.originWidth >
        activeItem.value.height / activeItem.value.originHeight
      ) {
        activeItem.value.width =
          activeItem.value.height * (activeItem.value.originWidth / activeItem.value.originHeight)
      } else {
        activeItem.value.height =
          activeItem.value.width * (activeItem.value.originHeight / activeItem.value.originWidth)
      }
    }

    if (activeItem.value.width < 10) {
      activeItem.value.width = 10
    }

    activeItem.value.clipTop = (activeItem.value.height / height) * activeItem.value.clipTop
    activeItem.value.clipLeft = (activeItem.value.width / width) * activeItem.value.clipLeft
    activeItem.value.clipWidth = (activeItem.value.width / width) * activeItem.value.clipWidth
    activeItem.value.clipHeight = (activeItem.value.height / height) * activeItem.value.clipHeight
  }
}
const onControllerRotatDown = (x, y) => {
  rotating.value = true
  rotatingX.value = x
  rotatingY.value = y
  window.addEventListener("mousemove", onControllerRotatMove)
  window.addEventListener("mouseup", onControllerMouseUp)
}
const onControllerRotatMove = (e) => {
  if (activeItem.value) {
    var dx = e.clientX - startX.value
    var dy = e.clientY - startY.value
    var deltaAngle = Math.atan2(dy * -rotatingY.value, dx * -rotatingX.value)
    activeItem.value.rotate = startItem.value.rotate + deltaAngle * (180 / Math.PI)
  }
}

const onControllerMouseMove = (e) => {
  if (activeItem.value) {
    activeItem.value.left += e.movementX
    activeItem.value.top += e.movementY
  }
}

const onControllerMouseUp = (e) => {
  moving.value = false
  sizing.value = false
  rotating.value = false
  cliping.value = false
  window.removeEventListener("mousemove", onControllerMouseMove)
  window.removeEventListener("mousemove", onControllerSizeMove)
  window.removeEventListener("mousemove", onControllerRotatMove)
  window.removeEventListener("mousemove", onControllerClipMove)
  window.removeEventListener("mouseup", onControllerMouseUp)
}

watch(activeItem, (v) => {
  console.log(v)
  if (v) {
    bottomEl.value.scrollIntoViewIfNeeded()
  }
})
</script>
