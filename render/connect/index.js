import primise from "./promise";
import ConnectStream from "./connect-stream";
const Connect = {
  run(event, payload = {}) {
    return primise(event, payload);
  },
  addData(table, data) {
    return primise("addData", {
      table,
      data
    });
  },
  setData(table, data) {
    return primise("setData", {
      table,
      data
    });
  },
  getData(table) {
    return primise("getData", { table });
  },
  deleteData(table, data) {
    return primise("deleteData", {
      table,
      data
    });
  },
  stream(code, data) {
    return new ConnectStream(code, data);
  }
};

export default Connect;
