import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    username: "USERNAME",
    isMobile: false
  },
  mutations: {
    emptyEntry(state) {
      const dt = Date.now();
      const num = Math.floor(Math.random() * 999999);
      const id = parseInt(`${dt}${num}`)

      state.list.push({name: "", link: "", img: "", id: id})
    },

    checkMobile(state, payload) {
      state.isMobile = payload <= 768;
    },

    removeEntry(state, payload) {
      let removeIndex = state.list.map(item => item.id).indexOf(payload);
      state.list.splice(removeIndex, 1);
      console.log(state.list)
    },

    addExample(state) {
      state.list = [{name: "Youtube", link: "https://youtube.com", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/YouTube_social_white_squircle_%282017%29.svg/1200px-YouTube_social_white_squircle_%282017%29.svg.png", id: 1},
                    {name: "Instagram", link: "https://instagram.com", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png", id: 2},
                    {name: "Twitter", link: "https://twitter.com", img: "https://image.flaticon.com/icons/png/512/124/124021.png", id: 3},
                    {name: "TikTok", link: "https://tiktok.com", img: "https://cdn.worldvectorlogo.com/logos/tiktok-logo-2--1.svg", id: 4}]
    },

    updateText(state, payload) {
      state.username = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
