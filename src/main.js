import Vue from "vue";
import VueRouter from "vue-router";
import { Plugin } from "vue-fragment";
import AudioVisual from "vue-audio-visual";
import App from "./App.vue";

Vue.use(VueRouter);
Vue.use(Plugin);
Vue.use(AudioVisual);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
