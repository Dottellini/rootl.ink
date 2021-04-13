<template>
  <div class="container" >
    <preview :use-phone="false"></preview>
  </div>
</template>

<script>
import Preview from "../components/Preview";
export default {
  name: "Userpage",
  components: {Preview},

  computed: {
    user() {
      return this.$route.params.username
    },

    bg_hex: function () {
      return {backgroundColor: this.$store.state.background_hex}
    },
  },

  watch: {
    $route(to, from) {
      this.$store.dispatch("fetchUserData", to.params.username);
    }
  },

  mounted() {
    this.$store.dispatch("fetchUserData", this.$route.params.username);

    document.getElementsByTagName("body")[0].style.backgroundColor = this.bg_hex.backgroundColor;
  },

  destroyed() {
    document.getElementsByTagName("body")[0].style.backgroundColor = null;
  }
}

</script>

<style lang="scss">

</style>