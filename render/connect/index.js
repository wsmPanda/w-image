const { ipcRenderer } = window.require("electron");
//import { ipcRenderer } from "electron";
console.log(ipcRenderer);
let eventWatcher = {};
let _id = 0;
function getConnectId() {
  return _id++;
}
ipcRenderer.on("promiseConnectRequest", (event, { id, data }) => {
  if (eventWatcher[id]) {
    eventWatcher[id](data);
    eventWatcher[id] = null;
  }
});
function pormiseConnect(event, payload) {
  let connectId = getConnectId();
  ipcRenderer.send(
    "promiseConnectRespnose",
    Object.assign({}, payload, { id: connectId, type: event })
  );
  return new Promise((resolve) => {
    eventWatcher[connectId] = resolve;
  });
}
export default {
  getTree() {
    return pormiseConnect("getTree", {});
  },
  getTreeFiles(e) {
    return pormiseConnect("getTreeFiles", e);
  },
  selectDictiry(e) {
    return pormiseConnect("selectDictiry", e);
  },
  addDictiry(e) {
    return pormiseConnect("addDictiry", e);
  },
  getDictory(e) {
    return pormiseConnect("getDictory", e);
  },
  getDictoryFolder(e) {
    return pormiseConnect("getDictoryFolder", e);
  }
};
