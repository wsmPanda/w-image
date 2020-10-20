import promise from "./promise";
export default class ConnectStream {
  constructor(event, payload, options) {
    this.event = event;
    this.payload = payload;
    this.options = options;
    this.finish = false;
    this.loading = false;
    return this;
  }
  async next() {
    await this.initConnect();
    let res = await promise(this.event, {
      ...this.payload,
      iteratorId: this.iteratorId,
    });
    return res.data;
  }
  async initConnect() {
    if (this.iteratorId) {
      return;
    }
    let res = await promise(this.event, this.payload);
    this.iteratorId = res.iteratorId;
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
