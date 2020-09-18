import ConnectType from "./type";
import { ipcMain } from "electron";
export default function() {
  ipcMain.on("promiseConnectRespnose", (event, payload) => {
    if (ConnectType[payload.type]) {
      ConnectType[payload.type](event, payload).then((res) => {
        event.sender.send("promiseConnectResquest", res);
      });
    }
  });
}
