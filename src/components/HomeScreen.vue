<template>
  <div>
    <div class="content" :class="{'content-background': !isMobile}" >
      <h1>{{$t('homepage.headline.one')}}<br>{{$t('homepage.headline.two')}}</h1>
      <h2>{{$t('homepage.footnote')}}</h2>
      <button @click="scroll" class="learnButton">{{$t('homepage.learn_more')}}</button>
      <Preview class="preview" :use-phone="true"></Preview>
      <div class="line"></div>
      <div class="input">
        <p class="text">rootl.ink/</p>
        <input type="text" class="input-field"
               maxlength="30"
               @change="updateText"
               v-model="username"
               @keydown.delete.once="clearInput"
               @click="clearInput"
               @input.once="scrollBottom"
               placeholder="Username">
      </div>
      <transition name="bounce">
        <div v-show="username.length > 0 && showButton" class="line"></div>
      </transition>
      <transition name="bounce">
        <button @click="redirect('register')" v-show="username.length > 0 && showButton" class="register">{{$t('homepage.start_creating')}}</button>
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
      username: "",
      showButton: false,
      isMobile: this.$store.state.isMobile
    }
  },
  methods: {
    redirect(path){
      this.$router.push({path: path})
    },

    scrollBottom() {
      window.scroll(0, document.body.scrollHeight)
    },

    scroll() {
      window.scroll(0, 620)
    },

    clearInput () {
        this.showButton = true;
    },

    updateText () {
      localStorage.setItem('preRegisterUsername', this.username);
      this.$store.commit("updateText", this.username)
    }
  },

  beforeCreate() {
    let theme = localStorage.getItem('theme');
    let isDark = theme !== "";
    this.$store.commit("addExample", isDark)
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
    height: auto;
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
    cursor: pointer;
  }

  .register {
    cursor: pointer;
    text-decoration: none;
    outline: none;
    border: 1px solid var(--background-color);
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
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
    }

    .input-field {
      font-size: 30px;
      background-color: var(--background-color);
      color: var(--text-color);
      width: 8em;
      height: 1em;
      outline: none;
      border: none;
      border-radius: 0;
      border-bottom: 2px solid var(--text-color);
      font-family: 'Montserrat', sans-serif;
    }

    @media screen and (max-width: 768px) {
      font-size: 23px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
</style>