import ConnectType from "./type";
import TaskType from "./task";
import { ipcMain } from "electron";
export default function() {
  ipcMain.on("promiseConnectRespnose", async (event, payload) => {
    let connectType = ConnectType[payload.type] || TaskType[payload.type];
    if (connectType) {
      let res = await connectType(payload, event);
      event.sender.send("promiseConnectRequest", {
        id: payload.id,
        data: res
      });
    }
  });
}
