import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueGtag from "vue-gtag";
import VueAnalytics from 'vue-analytics';
import i18n from './i18n';
import FlagIcon from 'vue-flag-icon';

Vue.config.productionTip = false

Vue.use(FlagIcon)

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
  i18n,
  render: h => h(App)
}).$mount('#app')
