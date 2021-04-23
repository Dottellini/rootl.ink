<template>
  <Tabs>
    <Tab title="Account" class="tab">
      <edit-account-details></edit-account-details>
    </Tab>
    <Tab title="Analytics" class="tab"></Tab>
  </Tabs>
</template>

<script>
import EditAccountDetails from "../components/EditAccountDetails";
import Tabs from "../components/TabSystem/Tabs"
import Tab from "../components/TabSystem/Tab"

export default {
  name: "account",
  components: {
    EditAccountDetails,
    Tabs,
    Tab
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