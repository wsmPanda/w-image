import { app, shell, BrowserWindow, protocol } from "electron"
import { join } from "path"
import { electronApp, is } from "@electron-toolkit/utils"
import url from "url"
import ProcessCreate from "./create"
import ProcessReady from "./ready"
import WindowConfig from "./window"

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow(WindowConfig)
  ProcessCreate(mainWindow)

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron")

  app.whenReady().then(() => {
    protocol.registerFileProtocol("image", (request, callback) => {
      try {
        const filePath = url.fileURLToPath(
          "file://" +
            request.url
              .slice("image://".length)
              .split(/\\|\//)
              .map((item, index) => {
                return index ? encodeURIComponent(decodeURI(item)) : item
              })
              .join("\\")
        )
        callback(filePath)
      } catch (ex) {
        callback("file://" + request.url.slice("image://".length))
      }
    })
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils

  // app.on("browser-window-beforeMount", (_, window) => {
  //   optimizer.watchWindowShortcuts(window)
  // })
  ProcessReady()
  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
