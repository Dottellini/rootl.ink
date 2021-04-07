<template>
  <div id="app">
    <div class="content">
      <div id="header" class="header">
        <div id="logo">
          <router-link id="homeroute" to="/"><h1>rootl.ink</h1></router-link>
        </div>
        <div id="routes" class="child">
          <Slide right>
            <div v-if="loggedIn">

            </div>
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

    <div id="nav" class="navbar">
      <router-link class="route nav-child" to="/">Home</router-link>
      <router-link class="route nav-child" to="/editor">Editor</router-link>
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
      theme: ""
    };
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
    --text-color: #0f0f0f;
    --burger-page-color: rgba(0, 0, 0, 0.1);
    --ghost-color: #e0f3ff;
    --device-border-color: #222;
  }

  [data-theme="darkMode"] {
    --background-color: #0f0f0f;
    --text-color: white;
    --burger-page-color: rgba(0, 0, 0, 0.9);
    --ghost-color: #3d3d60;
    --device-border-color: #323232;
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
    font-size: 2em;
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

  .content {
    padding-bottom: 3.5em;
  }

  .navbar {
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
    width: 2.5em;
    height: 2em;
    top: 30%;
    cursor: pointer;
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
    height: 0.3em;
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
