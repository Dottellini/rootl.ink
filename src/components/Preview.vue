<template>
  <div id="preview" class="container" @click="log">
    <div class="bar"></div>
    <div class="url-container">
      <h1>rootl.ink/</h1><h2>{{username}}</h2>
    </div>
    <img src="https://de.meming.world/images/de/thumb/b/bc/Mike_Wazowski-Sulley_Face_Swap.jpg/300px-Mike_Wazowski-Sulley_Face_Swap.jpg" width="100" height="100">
    <div id="links">
      <div v-for="link in links">
        <div class="linkBox" v-if="link.name !== ''">
          <img :src='link.img' height="40px" width="40px">
          <div class="link-box-text">
            <a target="_blank" :href="link.link">{{link.name}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Preview",
  data() {
    return{
      links: this.$store.state.list,
    }
  },

  computed: {
    username: function () {
      return this.$store.state.username
    }
  },

  methods: {
    log: function () {
      console.log(this.username)
    }
  }
}
</script>

<style scoped lang="scss">
  .bar{
    background: var(--device-border-color);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    height: 1.56em;
    left: 5em;
    position: relative;
    width: 15em;
  }

  .container {
    color: var(--text-color);
    font-size: 12px;
    border-style: solid;
    border-width: 1em;
    border-radius: 50px;
    border-color: var(--device-border-color);
    height: 50em;
    width: 25em;
  }

  .url-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;

    h2{
      margin-left: -0.3em;
    }
  }

  .linkBox {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: black;
    margin: 1em auto;
    padding: 0.3em 0;
    max-width: 21em;
    border-radius: 50px;

    .link-box-text {
      width: 100%;
    }

    img {
      border-radius: 50%;
      margin-left: 0.3em;
      float: left;
    }
    a{
      font-weight: 600;
      font-family: 'Montserrat', sans-serif;
      color: white;
      text-decoration: none;
    }
  }

  img{
    border-radius: 50px;
  }
</style>