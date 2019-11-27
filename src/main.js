import Vue from "vue";
import App from "./App.vue";
import './assets/app.scss';

// Config sample.config with key required
import google from "../config/google";

// Libraries
import * as VueGoogleMaps from "vue2-google-maps";

// Vue scroll
import VueDragscroll from 'vue-dragscroll';
Vue.use(VueDragscroll);

// Vuex Store
import store from "./store";

// Vue MQ
import VueMq from 'vue-mq'
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 1023,
    desktop: Infinity,
  }
})

// Vue Google Maps Init
Vue.use(VueGoogleMaps, {
  load: {
    key: google.mapKey,
    libraries: ["places"],
    v: "3.26"
  },
  installComponents: false
});

Vue.component("branch-finder", App);

document.addEventListener("DOMContentLoaded", event => {
  if (document.querySelectorAll("branch-finder").length) {
    new Vue({
      el: "branch-finder",
      store,
      render: h => h(App)
    });
  }
});
