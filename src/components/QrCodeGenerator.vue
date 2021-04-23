<template>
  <div>
    <VueQArt :config="config"></VueQArt>
    <button @click="download">Download</button>
  </div>
</template>

<script>
import VueQArt from 'vue-qart'

export default {
  name: "qr-code-generator",
  components: {VueQArt},

  data() {
    return {
      config: {
        value: `https://youtube.com`, //`https://rootl.ink/${this.$store.state.account_username}`
        imagePath: "../assets/logo.png",
        filter: 'color'
      }
    }
  },

  methods: {
    download: function () {
      const myCanvas = this.$refs.qart.children[0];
      const type = 'image/png';
      window.location.href = myCanvas.toDataURL(type).replace(type, "image/octet-stream"); // it will save locally
    }
  }
}
</script>

<style scoped>

</style>