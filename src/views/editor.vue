<template>
  <div>
    <PageBuilder class="flex-child" width="73vw" height="88vh">
      <Preview :use-phone="true" id="Preview"/>
    </PageBuilder>
  </div>
</template>

<script>
import PageBuilder from "../components/NewNewPageBuilder";
import Preview from "../components/Preview.vue";

export default {
  name: 'Editor',
  components: {
    PageBuilder,
    Preview
  },

  beforeCreate() {
    if(!this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  },

  mounted() {
    this.$store.dispatch("fetchUserData", {username: this.$store.state.account_username, origin: this.$router.currentRoute})
    this.$store.commit('changeProfilePicture', this.$store.state.account_profile_picture)
    this.$store.commit('changeUsername', this.$store.state.account_username)
  },

  destroyed() {
    // TODO: this.$store.commit('changeProfilePicture', )
    this.$store.commit('changeUsername', 'USERNAME')
  }
}
</script>

<style scoped lang="scss">

  .flex-container{
    max-height: 80vh;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    display: flex;
    align-items: flex-start;

    @media screen and (max-width: 768px){
      flex-direction: column;
      align-items: center;
    }
  }

  #Preview{
    margin-top:15px;
  }

  .flex-child {
    margin-top:15px;
    padding: 5px;
    border-radius: 25px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .flex-child:first-child {
    margin-right: 1em;

    @media screen and (max-width: 768px){
      margin: 1em 0;
    }
  }
</style>
