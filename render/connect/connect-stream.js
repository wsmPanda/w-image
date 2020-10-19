import core from "./core";
export default class ConnectStream {
  constructor(code, data, options) {
    this.code = code;
    this.data = data;
    this.options = options;
    this.id = core.getConnectId();
  }
  on() {
    return this;
  }
  stop() {}
  onData(cb) {
    return this.on("data", cb);
  }
  onEnd(cb) {
    return this.on("error", cb);
  }
}
