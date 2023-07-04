import primise from "./promise"
import task from "./task"
import ConnectStream from "./connect-stream"
import { toRawData } from "./raw"

const Connect = {
  run(event, payload = {}) {
    return primise(event, payload)
  },
  task(event, payload = {}, callback) {
    return task(event, payload, callback)
  },
  addData(table, data) {
    return primise("addData", {
      table,
      data: toRawData(data)
    })
  },
  setData(table, data) {
    return primise("setData", {
      table,
      data: toRawData(data)
    })
  },
  editData(table, data) {
    return primise("editData", {
      table,
      data: toRawData(data)
    })
  },
  getData(table) {
    return primise("getData", { table })
  },
  deleteData(table, data) {
    return primise("deleteData", {
      table,
      data: toRawData(data)
    })
  },
  stream(code, data) {
    return new ConnectStream(code, data)
  }
}

export default Connect
