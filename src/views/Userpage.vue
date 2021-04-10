<template>
  <div class="container">
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
    }
  },

  watch: {
    $route(to, from) {
      this.$store.dispatch("fetchUserData", to.params.username);
    }
  },

  created() {
    this.$store.dispatch("fetchUserData", this.$route.params.username);
  }
}

</script>

<style scoped lang="scss">
  .container {
  }
</style>