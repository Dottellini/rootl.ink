<template>
  <div @click="showInput= !showInput" class="Newsletter" :ref="'wrapper-1'" :style="boxColor">
    <img :src=link.img
      class="Image" 
      height="40px" 
      width="40px" 
      v-if="link.img !== ''">
    <div class="NewsletterText">
      <a target="_blank" :style="textColor" :href="link.link">{{link.name}}</a>
    </div>
    <input v-if="showInput">
    <button v-if="showInput">Submit</button>
    <button v-if="showInput">Hide</button>
  </div>
</template>

<script>
  export default {
    name: "Newsletter",
    props:["link", "boxColor", "textColor"],
    data() {
      return {
        isDark: false,
        showInput: false
      }
    },

    mounted() {
      let theme = localStorage.getItem('theme');
      this.isDark = theme !== "";
      this.$store.commit("changeThemeOnPreview", this.isDark)
    },

    /*computed: {
      isembedded: function() {
        return "{{link.embedded}}"
      },
    },*/
  }
</script>

<style scoped lang="scss">
  
  .Image {
    min-width: 40px;
    min-height: 40px;
  }

  .Newsletter {
    height: 40px;
    border-radius: 5px;
    display: flex;
    flex-direction:row;
    width: 21em;
    align-items: center;
    justify-content: flex-start;
    margin: 1em auto;
    padding: 0.3em 0;
    border-radius: 5px;


    .NewsletterText {
      width: 100%;
    }

    img {
      border-radius: 50%;
      margin-left: 0.3em;
      float: left;
    }
    a {
      font-weight: 600;
      font-family: 'Montserrat', sans-serif;
      text-decoration: none;
    }
  }

</style>