import {
  walkFilesAsync,
  isImage,
  getDirectryTree,
  getDirectryFileTree
} from "./util";
const TestPath = "/Users/wangsongmao/Downloads";
export default {
  
};
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
  let path = TestPath;
  walkFilesAsync(path, (x) => {
    if (isImage(x)) {
      list.push(x);
    }
  });
  event.sender.send("selected-directory", list);
});
ipcMain.on("get-tree", (event, { id }) => {
  console.log("tree");
  let path = TestPath;
  event.sender.send("get-tree", { id, payload: getDirectryTree(path) });
});
ipcMain.on("get-tree-files", (event, { path }) => {
  event.sender.send(
    "get-tree-files",
    getDirectryFileTree(TestPath + "/" + path)
  );
});