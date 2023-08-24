import { ref } from "vue"

const boardSetting = ref({
  lockRatio: true,
  scale: 1,
  background: "#ffffff",
  autoLayout: true,
  fullscreen: false,
  maxWidth: 300
})
const boardData = ref({
  items: []
})
const activeItem = ref(null as any)
export const useBoard = () => {
  const setActive = (item) => {
    activeItem.value = item
    setZindex(activeItem.value)
  }
  const setZindex = (target) => {
    let z = target.zIndex
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
  return {
    boardSetting,
    boardData,
    activeItem,
    setActive,
    setZindex,
    clearItems,
    resetItem
  }
}
