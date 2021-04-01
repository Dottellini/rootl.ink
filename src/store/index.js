import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
  },
  mutations: {
    emptyEntry(state) {
      const dt = Date.now();
      const num = Math.floor(Math.random() * 999999);
      const id = parseInt(`${dt}${num}`)

      state.list.push({name: "", link: "", img: "", id: id})
    }
  },
  actions: {
  },
  modules: {
  }
})
