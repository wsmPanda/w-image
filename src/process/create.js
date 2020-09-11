const { ipcMain, dialog } = require("electron");
import { walkFilesAsync } from "../util";
export default function() {
  ipcMain.on("open-file-dialog", (event) => {
    console.log("????");
    dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"]
      })
      .then((files) => {
        if (files) {
          let list = [];
          walkFilesAsync(files.filePaths[0], (x) => {
            list.push(files.filePaths[0] + "/" + x);
          });
          event.sender.send("selected-directory", list);
        }
      });
  });
}
