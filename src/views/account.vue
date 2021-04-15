<template>
  <tabs>
    <tab title="Account" class="tab">
      <edit-account-details></edit-account-details>
    </tab>
    <tab title="Analytics" class="tab"></tab>
  </tabs>
</template>

<script>
import EditAccountDetails from "../components/EditAccountDetails";
import tabs from "../components/tab-system/Tabs"
import tab from "../components/tab-system/Tab"

export default {
  name: "account",
  components: {
    EditAccountDetails,
    tabs,
    tab
  },

  beforeCreate() {
    if(!this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  }
}
</script>

<style scoped lang="scss">
  .tab {
    margin: 0 3em;
  }
</style>