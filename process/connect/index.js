import ConnectType from "./type";
import { ipcMain } from "electron";
export default function() {
  ipcMain.on("promiseConnectRespnose", async (event, payload) => {
    if (ConnectType[payload.type]) {
      let res = await ConnectType[payload.type](payload);
      event.sender.send("promiseConnectRequest", {
        id: payload.id,
        data: res,
      });
    }
  });
}
