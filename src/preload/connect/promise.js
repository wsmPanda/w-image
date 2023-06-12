import core from "./core"
import { ipcRenderer } from "electron"
export default function (event, payload = {}) {
  let connectId = core.getConnectId()
  ipcRenderer.send(
    "promiseConnectRespnose",
    Object.assign({}, payload, { id: connectId, type: event })
  )
  return new Promise((resolve) => {
    core.addConnectWatcher({
      id: connectId,
      type: "promise",
      callback: resolve
    })
  })
}
