const { ipcRenderer } = window.require("electron");
//import { ipcRenderer } from "electron";
console.log(ipcRenderer);
let _id = 0;
function getConnectId() {
  return _id++;
}
function pormiseConnect(event, payload) {
  let connectId = getConnectId();
  ipcRenderer.send(event, Object.assign({}, payload, { id: connectId }));
  return new Promise((resolve) => {
    let watcher = (event, { id, payload }) => {
      if (id === connectId) {
        ipcRenderer.off("get-tree", watcher);
        resolve(payload);
      }
    };
    ipcRenderer.on("get-tree", watcher);
  });
}
export default {
  getTree() {
    return pormiseConnect("get-tree", {});
  }
};
/*
ipcRenderer.on("get-tree-files", (event, path) => {
      console.log(path);
      this.images = path;
    });
 ipcRenderer.on("selected-directory", (event, path) => {
      this.images = path;
    });
    

*/
