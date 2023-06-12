import promise from "./promise"
import EventEmitter from "./event-emitter"
export default class ConnectStream extends EventEmitter {
  constructor(event, payload, options) {
    super()
    this.event = event
    this.payload = payload
    this.options = options
    this.finish = false
    this.loading = false
    return this
  }
  async next() {
    await this.initConnect()
    let res = await promise(this.event, {
      ...this.payload,
      iteratorId: this.iteratorId
    })
    if (res.finish) {
      this.emit("finish", this)
    }
    return res.data
  }
  async initConnect() {
    if (this.iteratorId) {
      return
    }
    let res = await promise(this.event, this.payload)
    this.iteratorId = res.iteratorId
  }
  stop() {}
  onFinish(cb) {
    return this.on("finish", cb)
  }
  onData(cb) {
    return this.on("data", cb)
  }
  onEnd(cb) {
    return this.on("error", cb)
  }
}
