import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGtag from "vue-gtag";
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false

//Google Analytics
Vue.use(VueGtag, {
  config: { id: "G-2ND6RJ4KKP" }
});

Vue.use(VueAnalytics, {
  id: 'G-2ND6RJ4KKP',
  router
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
