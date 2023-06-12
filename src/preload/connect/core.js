import { ipcRenderer } from "electron"

let eventWatcher = {}
let _id = 0
function getConnectId() {
  return _id++
}
ipcRenderer.on("promiseConnectRequest", (event, { id, data }) => {
  if (eventWatcher[id]) {
    eventWatcher[id].callback(data)
    if (eventWatcher[id].type === "promise") {
      eventWatcher[id] = null
    }
  }
})
ipcRenderer.on("taskRequest", (event, { id, data, state }) => {
  if (eventWatcher[id]) {
    eventWatcher[id].callback(data, state)
    if (state === "finish" || state === "error") {
      eventWatcher[id] = null
    }
  }
})
export default {
  getConnectId,
  addConnectWatcher(v) {
    eventWatcher[v.id] = v
  }
}
