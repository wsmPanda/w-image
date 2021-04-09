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
  ipcMain.on("taskRespnose", async (event, payload) => {
    let connectType = TaskType[payload.type];
    if (connectType) {
      connectType(payload, event, function(data) {
        event.sender.send("taskRequest", {
          id: payload.id,
          data: data,
          state: "pending"
        });
      })
        .then((res) => {
          event.sender.send("taskRequest", {
            id: payload.id,
            data: res,
            state: "finish"
          });
        })
        .catch((res) => {
          event.sender.send("taskRequest", {
            id: payload.id,
            data: res,
            state: "error"
          });
        });
    }
  });
}
