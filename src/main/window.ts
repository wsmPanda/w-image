import { join } from "path"
import icon from "../../resources/icon.png?asset"
const options: Electron.BrowserWindowConstructorOptions = {
  width: 1600,
  height: 600,
  show: false,
  autoHideMenuBar: true,
  ...(process.platform === "linux" ? { icon } : {}),
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,
    preload: join(__dirname, "../preload/index.js"),
    sandbox: false
  }
}
export default options
