import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGtag from "vue-gtag";

Vue.config.productionTip = false

//Google Analytics
Vue.use(VueGtag, {
  config: { id: "G-2ND6RJ4KKP" }
});



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
