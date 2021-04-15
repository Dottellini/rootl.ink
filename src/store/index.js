import Vue from 'vue'
import Vuex from 'vuex'
import router from "../router/index"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    username: "USERNAME", //Used for the "User-pages" and other stuff. This username if not to be used for the logged in account as it may change
    account_username: "Alfonso", //Used for logged in user
    profile_picture: "https://de.meming.world/images/de/thumb/b/bc/Mike_Wazowski-Sulley_Face_Swap.jpg/300px-Mike_Wazowski-Sulley_Face_Swap.jpg", //Used for UserPages
    account_profile_picture: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg", //Used for logged in user
    background_hex: "#FFFFFF",
    text_hex: "#FFFFFF",
    linkBox_hex: "#000000",
    rootLink_hex: "#000000",
    isLoggedIn: true,
    isMobile: false,
  },
  mutations: {
    login(state, payload) {
      state.isLoggedIn = true;
      state.account_username = payload;
    },

    changeThemeOnPreview(state, isDark) {
      if(isDark) {
        if(state.background_hex === "#FFFFFF" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#000000" && state.rootLink_hex === "#000000") {
          state.background_hex = "#181818";
          state.linkBox_hex = "#1d1d1d";
          state.rootLink_hex = "#FFFFFF";
          state.text_hex = "#FFFFFF"
        }
      } else if(!isDark){
        if(state.background_hex === "#121212" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#1d1d1d" && state.rootLink_hex === "#FFFFFF") {
          state.background_hex = "#FFFFFF";
          state.linkBox_hex = "#000000";
          state.rootLink_hex = "#000000"
          state.text_hex = "#FFFFFF"
        }
      }
    },

    setData(state, payload) {
      let data = JSON.parse(payload)
      console.log(data)
      state.list = data.url_list;
      state.background_hex = data.background_hex;
      state.text_hex = data.text_hex;
      state.linkBox_hex = data.text;
      state.rootLink_hex = data.text;
    },

    emptyEntry(state) {
      const dt = Date.now();
      const num = Math.floor(Math.random() * 999999);
      const id = parseInt(`${dt}${num}`)

      state.list.push({name: "", link: "", img: "", id: id})
    },

    checkMobile(state, payload) {
      state.isMobile = payload <= 768;
    },

    addImageToEntry(state, payload) {
      let index = state.list.map(item => item.id).indexOf(payload.id);
      state.list[index].img = payload.img;
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
                    {name: "TikTok", link: "https://tiktok.com", img: "https://cdn.worldvectorlogo.com/logos/tiktok-logo-2--1.svg", id: 4}];
      state.text_hex = "";
      state.linkBox_hex = "";
      state.rootLink_hex = "";
      state.background_hex = "";
    },

    updateText(state, payload) {
      state.username = payload;
    },

    updateBackgroundColor(state, payload) {
      state.background_hex = payload
    },

    updateTextColor(state, payload) {
      state.text_hex = payload
    },

    updateBoxColor(state, payload) {
      state.linkBox_hex = payload
    },

    updateRootLinkColor(state, payload) {
      state.rootLink_hex = payload
    }
  },
  actions: {
    loginValid({commit}){
      fetch('/testLogin', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
      }).then(response => {
        let reader = response.body.getReader()
        reader.read().then(function processText({done, value}) {
          if(done) return
          let string = new TextDecoder().decode(value)
          console.log(string)
          return reader.read().then(processText);
        })
      })
    },

    async fetchUserData({commit}, username) {
      let string;
      await fetch(`http://d26k63xuikc78y.cloudfront.net/${username.toLowerCase()}.json`, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'mode': "cors"
      }).then(data => {
        if(data.status === 403) {
          router.push({name: "PageNotFound"})
          return;
        }
        let reader = data.body.getReader();
        reader.read().then(function processText({done, value}) {
          if (done) {
            console.log('Stream complete');
            commit("setData", string)
            return
          }
          string = new TextDecoder().decode(value)
          return reader.read().then(processText);
        })
      }).catch((err) => {
        console.log(err)
        router.push({name: "PageNotFound"})
      })
    },

    savePage({commit}, state) {
      const data = {
        url_list: state.list,
        background_hex: state.background_hex,
        text_hex: state.text_hex,
        linkBox_hex: state.linkBox_hex,
        rootLink_hex: state.rootLink_hex,
      }

      console.log(data);

      fetch('/createPage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
  },
  modules: {
  }
})
