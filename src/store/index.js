import Vue from 'vue'
import Vuex from 'vuex'
import router from "../router/index"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    linkList: [],
    socialsList: [],
    username: "USERNAME", //Used for the "User-pages" and other stuff. This username if not to be used for the logged in account as it may change
    account_username: null, //Used for logged in user
    profile_picture: "https://de.meming.world/images/de/thumb/b/bc/Mike_Wazowski-Sulley_Face_Swap.jpg/300px-Mike_Wazowski-Sulley_Face_Swap.jpg", //Used for UserPages
    background_hex: "#FFFFFF",
    text_hex: "#FFFFFF",
    linkBox_hex: "#000000",
    rootLink_hex: "#000000",
    isLoggedIn: false, //Muss auf false gesetzt werden!!!!!!
    isMobile: false,
  },
  mutations: {
    isYoutubeVideo(state, payload) { //TODO: Was ist jetzt hiermit? Muss das weg?
      let index = state.linkList.map(item => item.id).indexOf(payload.id);
      state.linkList[index].isYoutubeVideo = payload.result;
    },

    login(state, payload) {
      console.log("XXXXXXXXXXXXXXXXXXXXXXXXX")
      console.log(state, payload)
      state.isLoggedIn = true;
      state.account_username = payload;
      state.account_profile_picture = '';
    },

    changeUsername(state, payload) {
      state.username = payload;
    },

    changeProfilePicture(state, payload) {
      state.profile_picture = payload;
    },

    logout(state, payload) {
      state.isLoggedIn = false;
      state.account_username = null;
      state.account_profile_picture = "";
      localStorage.setItem('username', null)
      localStorage.setItem('account_profilepicture', null)
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
        if(state.background_hex === "#181818" && state.text_hex === "#FFFFFF" && state.linkBox_hex === "#1d1d1d" && state.rootLink_hex === "#FFFFFF") {
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
      state.linkList = data.urlList;
      state.socialsList = data.socialsList;
      state.background_hex = data.background_hex;
      state.text_hex = data.text_hex;
      state.linkBox_hex = data.linkBox_hex;
      state.rootLink_hex = data.rootLink_hex;
      document.body.style.backgroundColor = state.background_hex;
    },

    emptyEntry(state, payload) {
      const dt = Date.now();
      const num = Math.floor(Math.random() * 999999);
      const id = parseInt(`${dt}${num}`)
      if(payload.type==="social"){
        state.socialsList.push({title: "", url: "", icon: "", id: id})
        return;
      }
      state.linkList.push({
        id: id,
        title: "",
        url: "",
        icon: "",
        type: payload.type,
        widgetParameter: {
          type: payload.widgetType
        }
      })
    },

    checkMobile(state, payload) {
      state.isMobile = payload <= 768;
    },

    addImageToEntry(state, payload) {
      if(payload.type==='social'){
        let index = state.socialsList.map(item => item.id).indexOf(payload.imgData.id);
        state.socialsList[index].icon = payload.imgData.img;
        return;
      }
      let index = state.linkList.map(item => item.id).indexOf(payload.imgData.id);
      state.linkList[index].icon = payload.imgData.img;
    },

    removeImageFromEntry(state, payload) {
      if(payload.type==='social'){
        let index = state.socialsList.map(item => item.id).indexOf(payload);
        state.socialsList[index].url = '';
        return;
      }
      let index = state.linkList.map(item => item.id).indexOf(payload);
      state.linkList[index].url = '';
    },

    removeEntry(state, payload, type) {
      if(payload.type==='social'){
        let removeIndex = state.socialsList.map(item => item.id).indexOf(payload.id);
        state.socialsList.splice(removeIndex, 1);
        return;
      }
      let removeIndex = state.linkList.map(item => item.id).indexOf(payload.id);
      state.linkList.splice(removeIndex, 1);
    },

    addExample(state, isDark) {
      state.linkList = [{title: "Youtube", url: "https://www.youtube.com", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/YouTube_social_white_squircle_%282017%29.svg/1200px-YouTube_social_white_squircle_%282017%29.svg.png", id: 1, type: "rootlink", widgetParameter: {type: "TODO"}},
                    {title: "Instagram", url: "https://instagram.com", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png", id: 2, type: "rootlink", widgetParameter: {type: "TODO"}},
                    {title: "Twitter", url: "https://twitter.com", icon: "https://image.flaticon.com/icons/png/512/124/124021.png", id: 3, type: "rootlink", widgetParameter: {type: "TODO"}},
                    {title: "TikTok", url: "https://tiktok.com", icon: "https://cdn.worldvectorlogo.com/logos/tiktok-logo-2--1.svg", id: 4, type: "rootlink", widgetParameter: {type: "TODO"}}];
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
        console.log(data)
        if(data.result === "ERROR") {
          localStorage.setItem('username', null)
          return
        }
        if(data.result === "OK" && localStorage.getItem('username')!= 'null' ) {
          let username = localStorage.getItem('username');
          console.log("Login1")
          console.log(username)
          commit("login", username)
        }
      })

    },

    async fetchUserData({commit}, payload) {
      let string;
      console.log("payload",payload)
      await fetch(`https://d35cozwh7dkec2.cloudfront.net/${payload.toLowerCase()}.json`, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'mode': "cors"
      }).then(data => {
        console.log("data",data)
        if(data.status === 403) {
          if(payload.origin.path === "/editor") {
            return;
          } else {
            router.push({name: "PageNotFound"})
            return;
          }
        }
        let reader = data.body.getReader();
        reader.read().then(function processText({done, value}) {
          if (done) {
            commit("setData", string)
            return
          }
          string = new TextDecoder().decode(value)
          return reader.read().then(processText);
        })
      }).catch((err) => {
        console.log("err",err)
        router.push({name: "PageNotFound"})
      })
    },

    savePage({commit}, state) {
      const data = {
        profilePicture: state.account_profile_picture,
        username: state.account_username,
        urlList: state.linkList,
        socialsList: state.socialsList,
        background_hex: state.background_hex,
        text_hex: state.text_hex,
        linkBox_hex: state.linkBox_hex,
        rootLink_hex: state.rootLink_hex,
      }

      fetch('/createPage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(() => {})
      .catch(() => {});
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
