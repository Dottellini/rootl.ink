<template>
  <div id="preview" :class="{container: usePhone}" :style="bg_hex">

    <!-- HEAD -->
    <div :class="{bar: usePhone}"></div>
    <div class="url-container" :style="rootl_hex">
      <h1>rootl.ink/</h1><h2>{{username}}</h2>
    </div>
    <img :src="profile_picture" width="100" height="100">

    <!-- Links -->
    <div id="links">
      <div v-for="link in links" :key="link.id" :ref="'link-'+link.id">
        <div class="linkBox-Wrapper" :class="{ embedded: link.embed }" :style="box_hex" v-if="link.name !== ''" @mouseenter="showEmbeded(link)" @mouseleave="hideEmbed(link)">
          <div class="linkBox" >
            <img :src='link.img' class="link-image" height="40px" width="40px" v-if="link.img !== ''">
            <div class="link-box-text">
              <a target="_blank" :style="text_hex" :href="link.link">{{link.name}}</a>
            </div>
          </div>
          <iframe v-if="link.embed" width="0px" height="0px" :src="getEmbedUrl(link.link)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen :ref="'video-'+link.id"></iframe>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import VideoEmbed from "../components/VideoEmbed";

export default {
  name: "Preview",
  components: {VideoEmbed},
  props: ["usePhone"],

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
      let wrapper = this.$refs[`link-${item.id}`][0].childNodes[0]
      let iframe = this.$refs[`video-${item.id}`];
      wrapper.style.width="580px";
      wrapper.style.height="335px";
      wrapper.style.verticalAlign="top";
      wrapper.style.borderRadius="5px";
      iframe[0].width = "560px"
      iframe[0].height = "315px"

    },

    hideEmbed: function (item) {
      if(!item.embed){
        return;
      }
      let wrapper = this.$refs[`link-${item.id}`][0].childNodes[0]
      let iframe = this.$refs[`video-${item.id}`];

      wrapper.style.width="21em";
      wrapper.style.height="40px";
      wrapper.style.verticalAlign="center";
      iframe[0].width = "0px"
      iframe[0].height = "0px"

    }
  },


  computed: {
    username: function () {
      return this.$store.state.username
    },

    profile_picture: function () {
      return this.$store.state.profile_picture
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

  .linkBox-Wrapper {
    display: flex;
    flex-direction:column;
    width: 21em;
    align-items: center;
    justify-content: flex-start;
    margin: 1em auto;
    padding: 0.3em 0;
    border-radius: 5px;
  }

  .linkBox {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: flex-start;
    width: 21em;
    border-radius: 5px;

    .link-box-text {
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

  .linkBox-Wrapper.embedded {
    transition: 0.15s;
  }

  .linkBox-Wrapper.embedded.clicked{
    width:580px;
    height:335px;
    vertical-align: top;
    border-radius: 5px;
  }

  img{
    border-radius: 50px;
  }

</style>