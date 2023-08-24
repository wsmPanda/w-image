<template>
  <div class="board-view">
    <BoardHeader></BoardHeader>
    <div ref="content" class="board-view-content" @mousedown="onMousedown">
      <BoardItem
        v-for="(item, index) of boardData.items"
        :key="index"
        @click.stop="setActive(item)"
        :data="item"
        class="board-item"
        :class="{
          active: activeItem === item
        }"
      >
      </BoardItem>
      <BoardController ref="controller"></BoardController>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, watch, computed, onMounted, onUnmounted } from "vue"
import { getImgWidthHeight } from "render/util/image"
import BoardItem from "./item.vue"
import BoardHeader from "./header.vue"
import BoardController from "./controller.vue"
import { useBoard } from "./useBoard.ts"

import "./style.less"

const $main = inject("$main")
const content = ref()
const controller = ref()
if (!$main.storage?.boardData) {
  $main.storage.boardData = { items: [] }
}
const { activeItem, boardData, setActive } = useBoard()
boardData.value = $main.storage.boardData

watch(
  () => {
    return $main.storage.active
  },
  async (v) => {
    if (v) {
      let { width, height } = await getImgWidthHeight(v)
      const originWidth = width
      const originHeight = height
      let maxWidth = content.value?.offsetWidth * 0.5
      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
      boardData.value.items = boardData.value.items || []
      boardData.value.items.push({
        top: 0,
        left: 0,
        originWidth,
        originHeight,
        width: width,
        height: height,
        zIndex: 0,
        clip: false,
        clipTop: 0,
        clipLeft: 0,
        clipWidth: width,
        clipHeight: height,
        name: v.split(/\\|\//).pop(),
        src: v,
        rotate: 0,
        ...getAutoLayout({ width, height })
      })
      $main.storage.boardData.items = boardData.value.items
      setActive(boardData.value.items[boardData.value.items.length - 1])
    }
  }
)

const getAutoLayout = ({ width, height }) => {
  let rightList = boardData.value.items.sort((a, b) => b.left + b.width - a.left - a.width)
  let bottomList = boardData.value.items.sort((a, b) => b.top + b.height - a.top - a.height)
  let rightMax = rightList[0] ? rightList[0].left + rightList[0].width : 0
  let bottomMax = bottomList[0] ? bottomList[0].top + bottomList[0].height : 0

  console.log(bottomList.map((b) => b.top + b.height))
  return {
    left: 0,
    top: bottomMax
  }
}

const onBoardKeydown = (e) => {
  if (e.code === "Delete" || e.code === "Backspace") {
    if (activeItem.value) {
      const index = boardData.value.items.indexOf(activeItem.value)
      if (index >= 0) {
        boardData.value.items.splice(index, 1)
        activeItem.value = null
      }
    }
  }
}

const onMousedown = (e) => {
  console.log(e)
  if (e.target === content.value) {
    activeItem.value = null
  }
}

onUnmounted(() => {
  window.removeEventListener("keydown", onBoardKeydown)
})
onMounted(() => {
  window.addEventListener("keydown", onBoardKeydown)
})

// const itemClipStyle = watch(boardData.items, (v) => {
//   console.log("?????")
//   $main.storage.boardData = $main.storage.boardData || {}
//   $main.storage.boardData.items = v
//   console.log("????")
// })
</script>
