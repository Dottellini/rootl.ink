<template>
  <div id="preview" :class="{container: usePhone}" :style="bg_hex">
    <div :class="{bar: usePhone}"></div>
    <div class="url-container" :style="rootl_hex">
      <h1>rootl.ink/</h1><h2>{{username}}</h2>
    </div>
    <img src="https://de.meming.world/images/de/thumb/b/bc/Mike_Wazowski-Sulley_Face_Swap.jpg/300px-Mike_Wazowski-Sulley_Face_Swap.jpg" width="100" height="100">
    <div id="links">
      <div v-for="link in links">
        <div class="linkBox" :style="box_hex" v-if="link.name !== ''">
          <img :src='link.img' class="link-image" height="40px" width="40px" v-if="link.img !== ''">
          <div class="link-box-text">
            <a target="_blank" :style="text_hex" :href="link.link">{{link.name}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Preview",
  props: ["usePhone"],

  mounted() {
    this.$store.commit("changeThemeOnPreview", this.isDark)
  },

  computed: {
    username: function () {
      return this.$store.state.username
    },

    links: function () {
      return this.$store.state.list
    },

    bg_hex: function () {
      return {backgroundColor: this.$store.state.background_hex}
    },

    text_hex: function () {
      return {color: this.$store.state.text_hex}
    },

    box_hex: function () {
      return {backgroundColor: this.$store.state.linkBox_hex}
    },

    rootl_hex: function () {
      return {color: this.$store.state.rootLink_hex}
    },
  },
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

  .no-image{
    padding-left: 40px;
  }

  .url-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;

    h2{
      margin-left: -0.3em;
    }
  }

  .link-image {
    min-width: 40px;
    min-height: 40px;
  }

  .linkBox {
    display: flex;
    height: 40px;
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