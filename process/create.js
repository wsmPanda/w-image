const { ipcMain, dialog } = require("electron");
import { walkFilesAsync, isImage, getDirectryTree } from "./util";
export default function() {
  ipcMain.on("open-file-dialog", (event) => {
    // dialog
    //   .showOpenDialog({
    //     properties: ["openFile", "openDirectory"]
    //   })
    //   .then((files) => {
    //     if (files) {
    //       let list = [];
    //       let path = "/Users/aaggmnnoosw / Downloads";
    //       walkFilesAsync(files.filePaths[0], (x) => {
    //         list.push(files.filePaths[0] + "/" + x);
    //       });
    //       event.sender.send("selected-directory", list);
    //     }
    //   });
    let list = [];
    let path = "/Users/wangsongmao/Downloads";
    walkFilesAsync(path, (x) => {
      if (isImage(x)) {
        list.push(x);
      }
    });
    event.sender.send("selected-directory", list);
  });
  ipcMain.on("get-tree", (event) => {
    console.log("tree");
    let path = "/Users/wangsongmao/Downloads";
    event.sender.send("get-tree", getDirectryTree(path));
  });
}
