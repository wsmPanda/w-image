import { ref } from "vue"

const boardSetting = ref({
  lockRatio: true,
  scale: 1,
  background: "#ffffff",
  autoLayout: true,
  fullscreen: false
})
const boardData = ref({
  items: []
})
const activeItem = ref(null)
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
  return {
    boardSetting,
    boardData,
    activeItem,
    setActive,
    setZindex,
    clearItems
  }
}
