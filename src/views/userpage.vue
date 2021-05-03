<template>
  <div class="container" height="100vh">
    <preview :use-phone="false"></preview>
  </div>
</template>

<script>
import Preview from "../components/Preview";
export default {
  name: "Userpage",
  components: {Preview},

  mounted() {
    //ga("send", "UserPage", "mount", this.user)

    /*fetch('/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: "Page Viewed",
        device: navigator.userAgent,
        country: "test"
      }),
      mode: "cors"
    }).then(result => {});*/

    fetch('/api/analytics/timm',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event: "Page Viewed",
        parameters: {}
      }),
    }).then((err,data)=>{console.log(err,data)});
  },
  computed: {
    user() {
      return this.$route.params.username
    },
  },

  watch: {
    $route(to) {
      this.$store.dispatch("fetchUserData", to.params.username);
    }
  },

  beforeCreate() {
    this.$store.dispatch("fetchUserData", this.$route.params.username);
  },

  destroyed() {
    document.getElementsByTagName("body")[0].style.backgroundColor = null;
  }
}

</script>

<style lang="scss">
body{
  height: 100vh;
}
#app{
  height: 100vh;
}
.content{
  height: 100vh;
  padding-bottom: 0;
}
#preview{
  height: 100vh;
}
</style>