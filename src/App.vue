<template>
  <div id="app">
    <div class="content">
      <div id="header" class="header" v-if="!isUserPage">
        <div id="logo">
          <router-link id="homeroute" to="/"><h1>rootl.ink</h1></router-link>
        </div>
        <div class="child">
          <div v-if="!isMobile" class="desktop-navbar">
            <router-link class="desktop-nav-item" to="/about">{{$t('app.about')}}</router-link>
            <router-link class="desktop-nav-item" to="/service">{{$t('app.service')}}</router-link>
            <router-link class="desktop-nav-item" to="/help">{{$t('app.help')}}</router-link>
            <button v-if="!isLoggedIn" class="register-button account-button">
              <router-link class="router" to="/register">{{$t('signUp')}}</router-link>
            </button>
            <div v-if="isLoggedIn" class="dropdown">
              <button class="dropbtn">{{$t('share')}}</button>
              <div class="dropdown-content">
                <a href="#" @click="copyLink">{{$t('copyRootlink')}}</a>
                <router-link to="/qr" >{{$t('qr')}}</router-link>
              </div>
            </div>
          </div>

          <Slide right :crossIcon="false" style="top: 0">
            <div v-if="!isLoggedIn">
              <div class="button-container">
                <button class="login-button account-button">
                  <router-link class="router" to="/login">{{$t('login')}}</router-link>
                </button>
              </div>

              <router-link v-if="isMobile" class="desktop-nav-item" to="/about">{{$t('app.about')}}</router-link>
              <router-link v-if="isMobile" class="desktop-nav-item" to="/service">{{$t('app.service')}}</router-link>
              <router-link v-if="isMobile" class="desktop-nav-item" to="/help">{{$t('app.help')}}</router-link>
            </div>
            <div v-if="isLoggedIn">
              <div class="account-container">
                <img class="profile-picture" :src="account_profile_picture" width="100" height="100">
                <div class="hello-msg">{{$t('app.greeting')}} {{account_username}}</div>
              </div>
              <router-link to="/account">{{$t('app.account')}}</router-link>
              <router-link to="/editor">{{$t('app.page')}}</router-link>

              <router-link v-if="isMobile" class="desktop-nav-item" to="/about">{{$t('app.about')}}</router-link>
              <router-link v-if="isMobile" class="desktop-nav-item" to="/service">{{$t('app.service')}}</router-link>
              <router-link v-if="isMobile" class="desktop-nav-item" to="/help">{{$t('app.help')}}</router-link>

            </div>
            <div class="DarkMode-Container">
              <div class="DarkMode-Label">{{$t('app.darkMode')}}</div>
              <span>
              <label class="switch">
                <input type="checkbox" @click="toggleTheme" v-model="isDark">
                <span class="slider round"></span>
              </label>
            </span>
            </div>
            <button v-if="isLoggedIn" type="button" class="logout-Button" @click="logout">{{$t('logout')}}</button>
            <div>
              <LanguageDrop></LanguageDrop>
            </div>
            <div class="test">
              <p>
                {{$t('app.googleAnalytics.click')}}<a href="#" @click.prevent="disableTracking"> {{$t('app.googleAnalytics.here')}} </a>{{$t('app.googleAnalytics.disable')}}
              </p>
            </div>
          </Slide right>
        </div>
      </div>
      <router-view/>
    </div>

    <div class="mobile-navbar" v-if="isMobile">
      <router-link class="route" to="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
          <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
        </svg>
      </router-link>
      <router-link class="route" to="/editor">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import LanguageDrop from "./components/LanguageDrop";
import i18n from "./i18n";
import { Slide } from "vue-burger-menu"

export default {
  components: {
    Slide,
    LanguageDrop
  },

  data() {
    return{
      loggedIn: true,
      isDark: false,
      theme: "",
    };
  },

  computed: {
    account_profile_picture: function () {
      return this.$store.state.account_profile_picture
    },

    account_username: function () {
      return this.$store.state.account_username
    },

    isMobile: function() {
      return this.$store.state.isMobile
    },

    isLoggedIn: function () {
      return this.$store.state.isLoggedIn
    },

    isUserPage: function () {
      return this.$route.name === "Userpage";
    }
  },

  created() {
    this.$store.commit("checkMobile", window.screen.width);
  },

  mounted() {
    let localTheme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", localTheme);
    this.theme = localTheme;
    this.isDark = this.theme !== "";
    this.$store.dispatch("loginValid");
    if(localStorage.getItem('language') === null) {
      i18n.locale = navigator.language.split('-')[0];
    } else {
      i18n.locale = localStorage.getItem('language');
    }
  },

  methods: {
    copyLink() {
      let link = `https://rootl.ink/${this.$store.state.account_username}`
      let dummy = document.createElement("input")
      document.body.appendChild(dummy);
      dummy.setAttribute("id", "dummy_id");
      document.getElementById("dummy_id").value = link;
      dummy.select();
      document.execCommand("copy")
      document.body.removeChild(dummy)
    },

    logout() {
      this.$store.dispatch("logout")
    },

    disableTracking() {
      this.$ga.disable();
      alert('Tracking disabled');
    },

    toggleTheme() {
      this.theme = this.theme === "darkMode" ? "" : "darkMode";
      this.isDark = this.isDark !== true;
      document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("theme", this.theme)
      this.$store.commit("changeThemeOnPreview", this.isDark)
    }
  }
};
</script>

<style lang="scss">
  :root {
    --background-color: white;
    --surface-color: white;
    --hover-color: #e5e5e5;
    --text-color: #0f0f0f;
    --text-unimportant-color: #444444;
    --burger-page-color: rgba(0, 0, 0, 0.05);
    --ghost-color: #e0f3ff;
    --device-border-color: #222;
    --editor-items-border: none;
    --upload-background-color: #ebeffa;
    --upload-color: #3d4ebb;
  }

  [data-theme="darkMode"] {
    --background-color: #181818;
    --surface-color: #1d1d1d;
    --hover-color: #3d3d3d;
    --text-color: white;
    --text-unimportant-color: #8b8b8b;
    --burger-page-color: rgba(0, 0, 0, 0.89);
    --ghost-color: #3d3d60;
    --device-border-color: #323232;
    --editor-items-border: 1px solid #272727;
    --upload-background-color: #454545;
    --upload-color: white;
  }

  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');

  html{
    scroll-behavior: smooth;
  }

  body {
    background: var(--background-color);
    margin: 0;
  }

  h1{
    font-weight: 900;
    font-size: 1.7em;
    margin: .3em ;
    font-family: 'Montserrat', sans-serif;
  }

  h2{
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
  }

  #homeroute {
    text-decoration: none;
    color: var(--text-color);
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  .hello-msg {
    font-size: 16px;
  }

  .desktop-navbar {
    display: flex;
    align-items: center;
    margin: 0 7em 0 0;
  }

  .desktop-nav-item {
    font-size: 20px;
    margin: 0 1em;
    font-weight: 600;
    color: var(--text-color);
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    @media screen and (max-width: 768px) {
      font-weight: 500;
    }
  }

  .button-container {
    display: flex;
  }

  .account-button {
    margin: 0 1em;
    padding: 0.4em;
    border: none;
    outline: none;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 0.9em;
  }

  .logout-Button {
    cursor: pointer;
    background-color: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--text-color);
    border-radius: 50px;
    font-size: 0.8em;
  }

  .login-button {
    background-color: var(--background-color);
    border: 1px solid var(--text-color);
    border-radius: 50px;

    .router {
      color: var(--text-color);
      text-decoration: none;
    }
  }

  .register-button {
    background-color: var(--text-color);
    border-radius: 50px;

    .router {
      color: var(--background-color);
      text-decoration: none;
    }
  }

  .content {
    padding-bottom: 3.5em;
  }

  .mobile-navbar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #536cc0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3.5em;
  }

  .route {
    font-weight: 500;
    color: white;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border-bottom: 2px solid black;
    background-color: var(--background-color);
  }

  .child {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dropbtn {
    background-color: transparent;
    border-radius: 10px 10px 0 0;
    border: 1px solid #05b8a6;
    color: #05b8a6;
    padding: 8px;
    margin: 0 0 0 1em;
    min-width: 8em;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
    min-width: 8em;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    left: 0;
    right: 0;
    display: none;
    position: absolute;
    margin: 0 0 0 1em;
    background-color: var(--surface-color);
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    z-index: 1;
    @media screen and (max-width: 768px) {
      position: relative;
    }
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: var(--text-color);
    font-family: 'Montserrat', sans-serif;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: var(--hover-color);
  }

  /* Show the dropdown menu on hover */
  .dropdown:hover .dropdown-content {
    display: block;
  }

  /* Change the background color of the dropdown button when the dropdown content is shown */
  .dropdown:hover .dropbtn {
    background-color: #05b8a6;
    border: 1px solid #05b8a6;
    color: white;
  }
  //Burger
  //////////////////////////////////////////////////////////////////////
  .bm-burger-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 1.9em;
    height: 1.2em;
    top: 0;
    margin: 0;
    padding: 0;

    @media screen and (max-width: 768px) {
      width: 2em;
      height: 1.4em;
    }
  }

  .bm-burger-bars {
    background-color: var(--text-color);
  }
  .line-style {
    position: absolute;
    height: 2px;
    left: 0;
    right: 0;
  }

  .bm-menu {
    display: flex;
    justify-content: center;
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1000; /* Stay on top */
    top: 0;
    left: 0;
    background-color: var(--background-color); /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: 0.5s; /*0.5 second transition effect to slide in the sidenav*/
  }

  .bm-overlay {
    background: var(--burger-page-color);
  }
  .bm-item-list {
    color: #b8b7ad;
    margin: 0;
    font-size: 20px;
    font-weight: 500;

    p{
      display: block;
      font-size: 10px;
      font-weight: 400;
      font-family: 'Montserrat', sans-serif;
      color: var(--text-unimportant-color);
      a {
        color: var(--text-unimportant-color);
      }
    }

    .account-container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-weight: 400;
      border-bottom: 1px solid var(--text-unimportant-color);

      .profile-picture {
        margin: 5px auto;
        border-radius: 50%;
      }
    }
  }
  .bm-item-list > * {
    text-decoration: none;
    color: var(--text-color);
    font-family: 'Montserrat', sans-serif;
    margin: 0 auto;
  }

  .bm-item-list > * > * {
    display: flex;
    justify-content: center;
    text-decoration: none;
    color: var(--text-color);
    font-family: 'Montserrat', sans-serif;
    padding: 0.7em;
    margin: 0 auto;
  }

  //DarkMode Switch
  /////////////////////////////////////////////////////////////////////
  .DarkMode-Container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .DarkMode-Label{
      font-family: 'Montserrat', sans-serif;
      color: var(--text-color);
      font-weight: 500;
    }
  }

  .switch {
    display: flex;
    position: relative;
    width: 40px;
    height: 24px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: #ffffff;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input + .slider {
    background: #000000;
  }

  input:checked + .slider {
    background-color: #ffffff;
  }

  input:checked + .slider:before {
    background-color: #000000;
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
  /////////////////////////////////////////////////////////////////////
</style>
