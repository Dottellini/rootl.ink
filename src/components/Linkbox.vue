<template>
  <a :target="linkOrEmbed(link).target" rel="noopener" :style="textColor" :href="linkOrEmbed(link).href">
    <div @click="toggleEmbed(link.embed)" :ref="'wrapper-1'" class="LinkBox-Wrapper" :class="{ embedded: link.embed, embedShown: embedShown, previewMode: previewMode}" :style="boxColor" viewp>
      <div class="LinkBox">
        <img :src=link.img
          class="LinkImage"
          height="40px"
          width="40px"
          v-if="link.img !== ''">
        <div class="LinkBoxText" :style="textColor">
          {{link.name}}
        </div>
      </div>
      <iframe :ref="'iframe-1'" v-if="link.embed" :src="getEmbedUrl(link.link)" width="0px" height="0px" title="YouTube video player" frameborder="0" allowfullscreen="true" :class="{embedShown: embedShown}" />
    </div>
  </a>
</template>

<script>
  export default {
    name: "Linkbox",
    props:["link", "boxColor", "textColor", "previewMode"],
    data() {
      return {
        isDark: false,
        embedShown: false
      }
    },

    mounted() {
      let theme = localStorage.getItem('theme');
      this.isDark = theme !== "";
      this.$store.commit("changeThemeOnPreview", this.isDark)
    },
    methods: {
      linkOrEmbed: function(link){
        if(!link.embed){
          return {
            "href": link.link,
            "target": "_blank"
          };
        }
        return {
          "href": undefined,
          "target": undefined
        };
      },
      toggleEmbed: function (embed) {
        if(embed){this.embedShown = !this.embedShown}
      },
      getEmbedUrl: function (url) {        
        url = url
        .replace('http://','')
        .replace('https://','')
        switch(url.split('/')[0]){
          case 'www.twitch.tv':
            return `https://player.twitch.tv/?video=${url.replace('www.twitch.tv/videos/','')}&parent=localhost`;
          case 'www.youtube.com':
            return `https://youtube.com/embed/${url.replace('www.youtube.com/watch?v=','').split('&')[0]}`
            //return url.replace(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/g, 'https://www.youtube.com/embed/$1')
          case 'vimeo.com':
            return `https://player.vimeo.com/video/${url.replace('vimeo.com/','')}`
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  a {
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    text-decoration: none;
  }

  .LinkImage {
    min-width: 40px;
    min-height: 40px;
  }
  .LinkBox-Wrapper {
    display: flex;
    flex-direction:column; 
    min-width: 21em;
    height: 40px;
    width: 33vw;
    vertical-align: center;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    margin: 1em auto;
    padding: 0.3em 0;
    border-radius: 5px;
  }
  iframe{
    width: 0;
    height: 0;
  }
  iframe[class=embedShown] {
    width: 95%;
    height: 87%;
  }
  .LinkBox-Wrapper.embedShown {
  width: 50vw;
  height:28.125vw;
}
  .previewMode{
  width: 21em;
}
  .previewMode.embedShown{
  width: 21em;
  height:11.8125em;
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
      font-weight: 600;
      font-family: 'Montserrat', sans-serif;
      text-decoration: none;
    }
    img {
      border-radius: 50%;
      margin-left: 0.3em;
      float: left;
    }
  }
</style>