<template>
  <div class="board-view">
    {{ moving }}
    {{ activeItem?.left }}
    <div ref="content" class="board-view-content">
      <BoardItem
        v-for="(item, index) of boardItems"
        :key="index"
        @click="onItemClick(item)"
        :data="item"
        class="board-item"
      >
      </BoardItem>
      <div
        v-show="activeItem"
        ref="controller"
        class="board-item-controller"
        :style="ControllerStyle"
        @mousedown="onControllerMouseDown"
      >
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
          class="controller-rotate controller-bottom-right"
          @mousedown.stop="onControllerRotatDown(-1, -1)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, watch, computed } from "vue"
import BoardItem from "./item.vue"
import "./style.less"
const $main = inject("$main")
const content = ref()
const controller = ref()
if (!$main.storage?.boardData) {
  $main.storage.boardData = { items: [] }
}
const boardData = $main.storage?.boardData
const boardItems = ref(boardData.items || [])

const activeItem = ref(null)
const onItemClick = (item) => {
  activeItem.value = item
}
watch(
  () => {
    return $main.storage.active
  },
  (v) => {
    if (v) {
      boardItems.value = []
      console.log("???", v)
      boardItems.value.push({
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        clip: false,
        clipTop: 0,
        clipleft: 0,
        clipWidth: 0,
        clipHeight: 0,
        src: v,
        rotate: 0
      })
      $main.storage.boardData.items = boardItems.value
    }
  }
)
const ControllerStyle = computed(() => {
  const data = activeItem.value || {}
  const style = {
    width: data.width + "px",
    height: data.height + "px",
    top: data.top + "px",
    left: data.left + "px",
    zIndex: data.zIndex || 0,
    transfrom: `rotate(${data.rotate || 0}deg)`
  }
  return style
})
const moving = ref(false)
const sizing = ref(false)
const sizingX = ref(0)
const sizingY = ref(0)
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
const onControllerSizeMove = (e) => {
  sizing.value = true
  if (activeItem.value) {
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
  }
}
const onControllerRotatDown = (e) => {
  sizing.value = true
  if (activeItem.value) {
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
  }
}

const onControllerMouseMove = (e) => {
  if (activeItem.value) {
    if (activeItem.value.left + e.movementX > 0) {
      activeItem.value.left += e.movementX
    }
    if (activeItem.value.top + e.movementY > 0) {
      activeItem.value.top += e.movementY
    }
  }
}

const onControllerMouseUp = (e) => {
  moving.value = false
  sizing.value = false
  window.removeEventListener("mousemove", onControllerMouseMove)
  window.removeEventListener("mousemove", onControllerSizeMove)
  window.removeEventListener("mouseup", onControllerMouseUp)
}
// const itemClipStyle = watch(boardItems, (v) => {
//   console.log("?????")
//   $main.storage.boardData = $main.storage.boardData || {}
//   $main.storage.boardData.items = v
//   console.log("????")
// })
</script>
