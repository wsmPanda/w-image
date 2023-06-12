import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import iview from "view-ui-plus"
import EventEmitter from "process/util/event-emitter"
import "remixicon/fonts/remixicon.css"
import "view-ui-plus/dist/styles/viewuiplus.css"
import { $on, $emit } from "render/util/gogocodeTransfer"

const app = createApp(App)
app.config.devtools = true
app.config.productionTip = false
app.config.globalProperties.$connect = Connect
app.config.globalProperties.$on = function (...arg) {
  if (!this.$emitter) {
    this.$emitter = new EventEmitter()
  }
  // return this.$emitter.on(...arg)
  return $on(this, ...arg)
}
app.config.globalProperties.$emit = function (...arg) {
  if (!this.$emitter) {
    this.$emitter = new EventEmitter()
  }
  //return this.$emitter.emit(...arg)
  return $emit(this, ...arg)
}
app.config.globalProperties.$set = function (k, v) {
  this[k] = v
}
window.ConnectRun = (event, payload) => {
  return window.Connect.run(event, payload ? JSON.parse(JSON.stringify(payload)) : payload)
}

app.use(router)
app.use(iview)
app.mount("#app")
app.use
