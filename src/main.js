import Vue from "vue";
import VueRouter from "vue-router";
import { Plugin } from "vue-fragment";
import App from "./App.vue";

Vue.use(Plugin);
Vue.use(VueRouter);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
