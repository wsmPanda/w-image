import primise from "./promise";
import ConnectStream from "./connect-stream";
const Connect = {
  run(event, payload = {}) {
    return primise(event, payload);
  },
  stream(code, data) {
    return new ConnectStream(code, data);
  }
};

export default Connect;
