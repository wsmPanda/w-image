const { ipcRenderer } = window.require("electron");
//import { ipcRenderer } from "electron";
let eventWatcher = {};
let _id = 0;
function getConnectId() {
  return _id++;
}
ipcRenderer.on("promiseConnectRequest", (event, { id, data }) => {
  if (eventWatcher[id]) {
    eventWatcher[id].callback(data);
    if (eventWatcher[id].type === "promise") {
      eventWatcher[id] = null;
    }
  }
});
export default {
  getConnectId,
  addConnectWatcher(v) {
    eventWatcher[v.id] = v;
  }
};
