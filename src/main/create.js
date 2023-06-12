import { initDB, selectTable } from "./db"
import Connect from "./connect"
export default async function (win) {
  await initDB()
  Connect()
  let resizeTimmer
  let storage = selectTable("storage").get()
  win.on("resize", () => {
    if (resizeTimmer) {
      clearTimeout(resizeTimmer)
    }
    resizeTimmer = setTimeout(() => {
      resizeTimmer = null
      let storage = selectTable("storage").get()
      storage.windowPosition = win.getContentBounds()
      selectTable("storage").merge(storage)
    }, 300)
  })
  if (storage && storage.windowPosition) {
    win.setSize(storage.windowPosition.width, storage.windowPosition.height)
    win.setPosition(storage.windowPosition.x, storage.windowPosition.y)
  }
}
