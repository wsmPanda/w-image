import { join } from "path"
import icon from "../../resources/icon.png?asset"

export default {
  width: 1600,
  height: 600,
  show: false,
  autoHideMenuBar: true,
  ...(process.platform === "linux" ? { icon } : {}),
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    webSecurity: false,
    enableRemoteModule: true,
    preload: join(__dirname, "../preload/index.js"),
    sandbox: false
  }
}
