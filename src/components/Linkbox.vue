<template>
  <div @mouseover="showEmbeded(link)" @mouseleave="hideEmbeded(link)" :ref="'wrapper-1'" class="LinkBox-Wrapper" :class="{ embedded: link.isembedded}" :style="boxColor" >
    <div class="LinkBox">
      <img :src=link.img
        class="LinkImage" 
        height="40px" 
        width="40px" 
        v-if="link.img !== ''">
      <div class="LinkBoxText">
        <a target="_blank" :style="textColor" :href="link.link">{{link.name}}</a>
      </div>
    </div>
    <iframe :ref="'iframe-1'" v-if="isembedded" :src="getEmbedUrl(link.link)" width="0px" height="0px" title="YouTube video player" frameborder="0"/>
  </div>
</template>

<script>
  export default {
    name: "Linkbox",
    props:["link", "boxColor", "textColor"],
    data() {
      return {
        isDark: false
      }
    },

    mounted() {
      let theme = localStorage.getItem('theme');
      this.isDark = theme !== "";
      this.$store.commit("changeThemeOnPreview", this.isDark)
    },
    methods: {
      getEmbedUrl: function (url) {
        return url.replace(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/g, 'https://www.youtube.com/embed/$1')
      },

      showEmbeded: function (item) {
        if(!item.embed){
          return;
        }
        let wrapper = this.$refs['wrapper-1'];
        let iframe = this.$refs['iframe-1'];
        wrapper.style.width="580px";
        wrapper.style.height="335px";
        wrapper.style.verticalAlign="top";
        wrapper.style.borderRadius="5px";
        iframe.width = "560px"
        iframe.height = "315px"
      },
      hideEmbeded: function (item) {
        if(!item.embed){
          return;
        }
        let wrapper = this.$refs['wrapper-1'];
        let iframe = this.$refs['iframe-1'];
        wrapper.style.width="21em";
        wrapper.style.height="40px";
        wrapper.style.verticalAlign="center";
        iframe.width = "0px"
        iframe.height = "0px"
      }
    },

    /*computed: {
      isembedded: function() {
        return "{{link.embedded}}"
      },
    },*/
  }
</script>

<style scoped lang="scss">
  
  .LinkImage {
    min-width: 40px;
    min-height: 40px;
  }

  .LinkBox-Wrapper {
    display: flex;
    flex-direction:column;
    width: 21em;
    align-items: center;
    justify-content: flex-start;
    margin: 1em auto;
    padding: 0.3em 0;
    border-radius: 5px;
  }

  .LinkBox {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: flex-start;
    width: 21em;
    border-radius: 5px;

    .LinkBoxText {
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