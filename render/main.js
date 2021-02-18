import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Connect from "render/connect";
import iview from "iview";
import 'remixicon/fonts/remixicon.css'
import "iview/dist/styles/iview.css";
Vue.use(iview);
Vue.config.devtools = false;
Vue.config.productionTip = false;
Vue.prototype.$connect = Connect;
new Vue({
  render: (h) => h(App),
  router
}).$mount("#app");
