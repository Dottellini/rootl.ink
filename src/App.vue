<template>
  <div id="app">
    <div class="content">
      <div id="header" class="header">
        <div id="logo">
          <router-link id="homeroute" to="/"><h1>rootl.ink</h1></router-link>
        </div>
        <div class="child">
          <div v-if="!isMobile" class="desktop-navbar">
            <router-link class="desktop-nav-item" to="/about">About us</router-link>
            <router-link class="desktop-nav-item" to="/service">Service</router-link>
            <router-link class="desktop-nav-item" to="/help">Help</router-link>
            <button class="register-button account-button">
              <router-link class="router" to="/register">Sign Up</router-link>
            </button>
          </div>
          <Slide right>
            <div class="button-container">
              <button class="login-button account-button">
                <router-link class="router" to="/login">Log In</router-link>
              </button>

            </div>
            <router-link to="/editor">Editor</router-link>
            <label class="switch">
              <input type="checkbox" @click="toggleTheme" v-model="isDark">
              <span class="slider round"></span>
            </label>
          </Slide right>
        </div>
      </div>
      <hr>
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
import { Slide } from "vue-burger-menu"

export default {
  components: {
    Slide,
  },

  data() {
    return{
      loggedIn: true,
      isDark: false,
      theme: "",
    };
  },

  computed: {
    isMobile: function() {
      return this.$store.state.isMobile
    }
  },

  created() {
    this.$store.commit("checkMobile", window.screen.width)
  },

  mounted() {
    let localTheme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", localTheme);
    this.theme = localTheme;
    this.isDark = this.theme !== "";
  },

  methods: {
    toggleTheme() {
      this.theme = this.theme === "darkMode" ? "" : "darkMode";
      this.isDark = this.isDark !== true;
      document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("theme", this.theme)
    }
  }
};
</script>

<style lang="scss">
  :root {
    --background-color: white;
    --surface-color: white;
    --text-color: #0f0f0f;
    --burger-page-color: rgba(0, 0, 0, 0.05);
    --ghost-color: #e0f3ff;
    --device-border-color: #222;
    --editor-items-border: none;
  }

  [data-theme="darkMode"] {
    --background-color: #121212;
    --surface-color: #1d1d1d;
    --text-color: white;
    --burger-page-color: rgba(0, 0, 0, 0.9);
    --ghost-color: #3d3d60;
    --device-border-color: #323232;
    --editor-items-border: 1px solid #272727;
  }

  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');

  html{
    scroll-behavior: smooth;
  }

  body {
    background: var(--background-color);
  }

  p{
    font-family: 'Montserrat', sans-serif;
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
  }

  .button-container {
    display: flex;
  }

  .account-button {
    margin: 0 1em;
    padding: 0.5em;
    border: none;
    outline: none;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 0.9em;
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
  }

  .child {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  //Burger
  //////////////////////////////////////////////////////////////////////
  .bm-burger-button {
    position: relative;
    width: 1.9em;
    height: 1.2em;
    cursor: pointer;
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
  .cross-style {
    position: absolute;
    top: 2em;
    right: 2px;
    cursor: pointer;
  }
  .bm-cross {
    background: #bdc3c7;
  }
  .bm-cross-button {
    height: 2em;
    width: 2em;
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
    padding-top: 3em; /* Place content 60px from the top */
    transition: 0.5s; /*0.5 second transition effect to slide in the sidenav*/
  }

  .bm-overlay {
    background: var(--burger-page-color);
  }
  .bm-item-list {
    color: #b8b7ad;
    margin-left: 10%;
    font-size: 20px;
  }
  .bm-item-list > * {
    display: flex;
    text-decoration: none;
    padding: 0.7em;
  }
  .bm-item-list > * > span {
    margin-left: 10px;
    font-weight: 700;
    color: white;
  }

  //DarkMode Switch
  /////////////////////////////////////////////////////////////////////
  .switch {
    position: relative;
    display: inline-block;
    width: 2em;
    height: 0.3em;
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
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
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
    -webkit-transform: translateX(1.3em);
    -ms-transform: translateX(1.3em);
    transform: translateX(1.3em);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 12px;
  }

  .slider.round:before {
    border-radius: 10px;
  }
  /////////////////////////////////////////////////////////////////////
</style>
