const { ipcRenderer } = window.require("electron");
//import { ipcRenderer } from "electron";
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
  selectDictory(e) {
    return pormiseConnect("selectDictory", e);
  },
  addDictory(e) {
    return pormiseConnect("addDictory", e);
  },
  getDictory(e) {
    return pormiseConnect("getDictory", e);
  },
  getFileInfo(e) {
    return pormiseConnect("getFileInfo", e);
  },
  openDictory(e) {
    return pormiseConnect("openDictory", e);
  },
  deleteDictory(e) {
    return pormiseConnect("deleteDictory", e);
  },
  deleteFile(e) {
    return pormiseConnect("deleteFile", e);
  },
  getDictoryFolder(e) {
    return pormiseConnect("getDictoryFolder", e);
  },
  setConfig(e) {
    return pormiseConnect("setConfig", e);
  },
  getConfig(e) {
    return pormiseConnect("getConfig", e);
  },
  setStorage(e) {
    return pormiseConnect("setStorage", e);
  },
  getStorage(e) {
    return pormiseConnect("getStorage", e);
  },
  saveDictoryCache(e) {
    return pormiseConnect("saveDictoryCache", e);
  },
  getDictoryCache(e) {
    return pormiseConnect("getDictoryCache", e);
  }
};
