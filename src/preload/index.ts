import { contextBridge, shell } from "electron"
import { electronAPI } from "@electron-toolkit/preload"
import Connect from "./connect"

(window as any).shell = shell as any
(window as any).Connect = Connect

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("shell", shell)
    contextBridge.exposeInMainWorld("Connect", Connect)
  } catch (error) {
    console.error(error)
  }
}
