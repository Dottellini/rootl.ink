<template>
  <div id="preview" :class="{container: usePhone}" :style="bg_hex">

    <!-- HEAD -->
    <div :class="{bar: usePhone}"></div>
    <div :class="{content: usePhone}">
      <div class="url-container" :style="rootl_hex">
        <h2 id="title">@{{username}}</h2>
      </div>
      <img :src="profile_picture" width="100" height="100">

    <!-- Links -->
    <div id="links">
      <div v-for="link in links" :key="link.id" :ref="'link-'+link.id" @click="clicked(link.title, link.id)"  @click.middle="clicked(link.title, link.id)">
        <Linkbox :link=link :boxColor=box_hex :textColor=text_hex :previewMode=usePhone />
      </div>
    </div>
      <!-- Socials -->
      <div id="socials">
        <a :href="social.url" v-for="social in socialsList" :key="social.id"><img class="socialImg" :src="social.icon"></a>
      </div>
    </div>
  </div>
</template>

<script>
import Linkbox from "../components/Linkbox";

export default {
  name: "Preview",
  components: {Linkbox},
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
    clicked(name, id) {
      fetch('/api/analytics/timm',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: "Link Clicked",
          parameters: {"linkId": id}
        }),
      }).then(()=>{});
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
      return this.$store.state.linkList
    },

    socialsList: function(){
      return this.$store.state.socialsList;
    },

    bg_hex: function () {
      return {background: this.$store.state.background_hex}
    },

    text_hex: function () {
      return {color: this.$store.state.text_hex}
    },

    box_hex: function () {
      return {background: this.$store.state.linkBox_hex}
    },

    rootl_hex: function () {
      return {color: this.$store.state.rootLink_hex}
    },
  },
}
</script>

<style scoped lang="scss">

#socials{
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.socialImg{
  width: 64px;
  height: 64px;
}
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
    max-height: 600px;
    min-width: 25em;
    width: 25em;
    max-width: 25em;
    margin-right: 10px;
  }

  .content {
    max-height: 585px;
    overflow-y: auto;
    overflow-x: hidden;
    -ms-overflow-style: none;  /* IE and Edge */

    &::-webkit-scrollbar {
      display: none; /* Hide scrollbar for Chrome, Safari and Opera */
    }
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