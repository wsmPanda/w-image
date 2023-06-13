import { contextBridge, shell } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import Connect from "./connect"

window.shell = shell
window.Connect = Connect

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("shell", shell)
    contextBridge.exposeInMainWorld("Connect", Connect)
  } catch (error) {
    console.error(error)
  }
}
