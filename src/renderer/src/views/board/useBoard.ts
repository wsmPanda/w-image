import { computed, ref, watch } from "vue"
import { functionDebounce } from "render/util"

const boardSetting = ref({
  lockRatio: true,
  scale: 1,
  background: "#ffffff",
  autoLayout: true,
  fullscreen: false,
  maxWidth: 300
})
const boards = ref<any[]>([])
const activeItem = ref(null as any)
window.Connect.getData("board").then((res) => {
  boards.value = res
})
const currentBoard = ref(0)

const saveBoards = () => {
  window.Connect.setData("board", boards.value)
}
watch(
  boards,
  functionDebounce(() => {
    saveBoards()
  }),
  {
    deep: true
  }
)
export const useBoard = () => {
  const openBoard = (i) => {
    currentBoard.value = i
  }
  const newBoard = () => {
    boards.value.push({
      name: "board",
      id: +new Date(),
      items: []
    })
    currentBoard.value = boards.value.length - 1
    activeItem.value = null
  }
  const removeBoard = (i) => {
    if (i === currentBoard.value) {
      currentBoard.value = 0
    }
    boards.value.splice(i, 1)
    if (!boards.value?.length) {
      newBoard()
    }
  }

  const setActive = (item) => {
    activeItem.value = item
    setZindex(activeItem.value)
  }
  const setZindex = (target) => {
    let z = target.zIndex + 1
    boardData.value.items.forEach((item: any) => {
      if (item.zIndex > z) {
        z = item.zIndex + 1
      }
    })
    target.zIndex = z || 1
  }
  const clearItems = () => {
    boardData.value.items = []
  }
  const resetItem = () => {
    const item = activeItem
    if (item.value) {
      let width = item.value.originWidth
      let height = item.value.originHeight
      if (width > boardSetting.value.maxWidth) {
        height = (boardSetting.value.maxWidth / width) * height
        width = boardSetting.value.maxWidth
      }
      Object.assign(item.value, {
        ...item.value,
        width,
        height,
        clipTop: 0,
        clipLeft: 0,
        clipWidth: width,
        clipHeight: height,
        rotate: 0
      })
    }
  }
  const boardData = computed(() => {
    return boards.value[currentBoard.value || 0] || { items: [] }
  })
  if (!boards.value.length) {
    newBoard()
  }
  return {
    boardSetting,
    boardData,
    activeItem,
    setActive,
    setZindex,
    clearItems,
    resetItem,
    newBoard,
    openBoard,
    currentBoard,
    boards,
    removeBoard
  }
}
