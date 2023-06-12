import core from "./core"
import { ipcRenderer } from "electron"
export default function (event, payload = {}, callback) {
  let connectId = core.getConnectId()
  ipcRenderer.send("taskRespnose", Object.assign({}, payload, { id: connectId, type: event }))
  return new Promise((resolve, reject) => {
    core.addConnectWatcher({
      id: connectId,
      type: "promise",
      callback: (data, state) => {
        callback(data, state)
        if (state === "finish") {
          resolve(data)
        } else if (state === "error") {
          reject(data)
        }
      }
    })
  })
}
