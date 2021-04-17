import Vue from 'vue'
import Vuex from 'vuex'
import router from "../router/index"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [],
    username: "USERNAME", //Used for the "User-pages" and other stuff. This username if not to be used for the logged in account as it may change
    account_username: null, //Used for logged in user
    profile_picture: "https://de.meming.world/images/de/thumb/b/bc/Mike_Wazowski-Sulley_Face_Swap.jpg/300px-Mike_Wazowski-Sulley_Face_Swap.jpg", //Used for UserPages
    account_profile_picture: "https://pbs.twimg.com/profile_images/949787136030539782/LnRrYf6e.jpg", //Used for logged in user
    background_hex: "#FFFFFF",
    text_hex: "#FFFFFF",
    linkBox_hex: "#000000",
    rootLink_hex: "#000000",
    isLoggedIn: false,
    isMobile: false,
  },
  mutations: {
    isYoutubeVideo(state, payload) {
      let index = state.list.map(item => item.id).indexOf(payload.id);
      state.list[index].isYoutubeVideo = payload.result;
    },

    login(state, payload) {
      state.isLoggedIn = true;
      state.account_username = payload;
    },

    changeUsername(state, payload) {
      state.username = payload;
    },

    logout(state, payload) {
      state.isLoggedIn = false;
      state.account_username = null;
      state.account_profile_picture = "";
      localStorage.setItem('username', null)
    },

    changeThemeOnPreview(state, isDark) {
      if(isDark) {
        if(state.background_hex === "#FFFFFF" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#000000" && state.rootLink_hex === "#000000") {
          state.background_hex = "#181818";
          state.linkBox_hex = "#1d1d1d";
          state.rootLink_hex = "#FFFFFF";
          state.text_hex = "#FFFFFF";
        }
      } else if(!isDark){
        if(state.background_hex === "#121212" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#1d1d1d" && state.rootLink_hex === "#FFFFFF") {
          state.background_hex = "#FFFFFF";
          state.linkBox_hex = "#000000";
          state.rootLink_hex = "#000000";
          state.text_hex = "#FFFFFF";
        }
      }
    },

    setData(state, payload) {
      let data = JSON.parse(payload)
      state.username = data.username;
      state.profile_picture = data.profilePicture;
      state.list = data.url_list;
      state.background_hex = data.background_hex;
      state.text_hex = data.text_hex;
      state.linkBox_hex = data.linkBox_hex;
      state.rootLink_hex = data.rootLink_hex;
      document.body.style.backgroundColor = state.background_hex;
    },

    emptyEntry(state) {
      const dt = Date.now();
      const num = Math.floor(Math.random() * 999999);
      const id = parseInt(`${dt}${num}`)

      state.list.push({name: "", link: "", img: "", isYoutubeVideo: false, embed: false, id: id})
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

    addExample(state, isDark) {
      state.list = [{name: "Youtube", link: "https://www.youtube.com/watch?v=2INpDCWOy0Q", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/YouTube_social_white_squircle_%282017%29.svg/1200px-YouTube_social_white_squircle_%282017%29.svg.png", isYoutubeVideo:true, embed: true, id: 1},
                    {name: "Instagram", link: "https://instagram.com", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png", isYoutubeVideo:false, embed: false, id: 2},
                    {name: "Twitter", link: "https://twitter.com", img: "https://image.flaticon.com/icons/png/512/124/124021.png", isYoutubeVideo:false, embed: false, id: 3},
                    {name: "TikTok", link: "https://tiktok.com", img: "https://cdn.worldvectorlogo.com/logos/tiktok-logo-2--1.svg", isYoutubeVideo:false, embed: false, id: 4}];
      if(isDark) {
        if(state.background_hex === "#FFFFFF" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#000000" && state.rootLink_hex === "#000000") {
          state.background_hex = "#181818";
          state.linkBox_hex = "#1d1d1d";
          state.rootLink_hex = "#FFFFFF";
          state.text_hex = "#FFFFFF";
        }
      } else if(!isDark){
        if(state.background_hex === "#121212" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#1d1d1d" && state.rootLink_hex === "#FFFFFF") {
          state.background_hex = "#FFFFFF";
          state.linkBox_hex = "#000000";
          state.rootLink_hex = "#000000";
          state.text_hex = "#FFFFFF";
        }
      }
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
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data => {
        if(data.result === "ERROR") {
          localStorage.setItem('username', null)
          return
        }
        if(data.result === "OK") {
          let username = localStorage.getItem('username');
          commit("login", username)
        }
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
        profilePicture: state.account_profile_picture,
        username: state.account_username,
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
    },

    logout({commit}) {
      fetch('/logout', {
        method: "POST"
      }).then(() => {
        commit("logout")
      })
    }
  },
  modules: {
  }
})
