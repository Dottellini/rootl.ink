<template>
  <div>
    <div class="content" :class="{'content-background': !isMobile}" >
      <h1>The root of<br>all your links</h1>
      <h2>The simplest way to redirect your audience</h2>
      <button @click="scroll" class="learnButton">Learn More</button>
      <Preview class="preview"></Preview>
      <div class="line"></div>
      <div class="input">
        <p class="text">rootl.ink/</p>
        <input type="text" class="input"
               maxlength="30"
               @input="updateText"
               v-model="username"
               v-on:keydown.delete.once="clearInput"
               @input.once="scrollBottom">
      </div>
      <transition name="bounce">
        <div v-show="username.length > 0 && showButton" class="line"></div>
      </transition>
      <transition name="bounce">
        <router-link to="/register" v-show="username.length > 0 && showButton" class="register">Start Creating!</router-link>
      </transition>
    </div>
  </div>
</template>

<script>
import Preview from "./Preview";

export default {
  name: "HomeScreen",
  components: {Preview},
  data() {
    return {
      username: "USERNAME",
      showButton: false,
      isMobile: this.$store.state.isMobile
    }
  },

  methods: {
    scrollBottom: function () {
      window.scroll(0, document.body.scrollHeight)
    },

    scroll: function() {
      window.scroll(0, 620)
    },

    clearInput: function () {
      this.username = "";
      this.showButton = true;
    },

    updateText: function () {
      this.$store.commit("updateText", this.username)
    }
  },

  beforeCreate() {
    this.$store.commit("addExample")
  }
}
</script>

<style scoped lang="scss">
  h1{
    color: var(--text-color);
    font-size: 5em;
    @media screen and (max-width: 768px) {
      font-size: 2.9em;
    }
  }
  h2{
    font-family: 'Montserrat', sans-serif;
    color: var(--text-color);
    font-weight: 500;
    font-size: 1.3em;
  }

  .content {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content-background {
    background-image: url("../assets/arrow_background.png");
    background-size: 1400px;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: 19em;
  }

  .preview {
    margin: 10em 0 0 0;
    @media screen and (max-width: 768px){
      font-size: 12px;
    }
  }

  .line {
    border-left: 3px solid var(--text-color);
    height: 60px;
  }

  .learnButton {
    outline: none;
    border: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 2em;
    color: white;
    background-color: #536cc0;
    border-radius: 50px;
    padding: 0.3em 1.5em;
    margin: 2em 0;
  }

  .register {
    cursor: pointer;
    text-decoration: none;
    outline: none;
    border: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 1.5em;
    color: var(--background-color);
    background-color: var(--text-color);
    border-radius: 50px;
    padding: 0.3em 1.5em;

    &:hover {
      color: var(--text-color);
      background-color: var(--background-color);
      border: 1px solid var(--text-color);
    }
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  .input {
    border: 1px solid var(--text-color);
    border-radius: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    padding: 0 0.4em;
    margin-left: 0.1em;
    .text {
      font-weight: 700;
    }

    .input {
      background-color: var(--background-color);
      color: var(--text-color);
      width: 9em;
      height: 1em;
      outline: none;
      border: none;
      border-radius: 0;
      border-bottom: 2px solid var(--text-color);
      font-family: 'Montserrat', sans-serif;
    }

    @media screen and (max-width: 768px) {
      font-size: 23px;
    }
  }
</style>