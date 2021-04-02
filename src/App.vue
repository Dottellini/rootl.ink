<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <button @click="toggleTheme">Toggle Theme</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return{
      theme: ""
    };
  },

  mounted() {
    let localTheme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", localTheme);
    this.theme = localTheme;
  },

  methods: {
    toggleTheme() {
      this.theme = this.theme === "darkMode" ? "" : "darkMode";
      document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("theme", this.theme)
    }
  }
};
</script>

<style lang="scss">
  :root {
    --background-color: white;
    --text-color: black;
  }

  [data-theme="darkMode"] {
    --background-color: black;
    --text-color: white;
  }


  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
