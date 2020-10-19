import ConnectStream from "./connect-stream";
import core from "./core";
const { ipcRenderer } = window.require("electron");
export default {
  run(event, payload = {}) {
    let connectId = core.getConnectId();
    ipcRenderer.send(
      "promiseConnectRespnose",
      Object.assign({}, payload, { id: connectId, type: event })
    );
    return new Promise((resolve) => {
      core.addConnectWatcher({
        id: connectId,
        type: "promise",
        callback: resolve
      });
    });
  },
  stream(code, data) {
    return new ConnectStream(code, data);
  }
};
