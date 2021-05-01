<template>
  <Tabs>
    <Tab title="Account" class="tab">
      <EditAccountDetails></EditAccountDetails>
    </Tab>
    <Tab title="Analytics" class="tab"></Tab>
      <Analytics></Analytics>
      
  </Tabs>
</template>

<script>
import Analytics from "../components/Analytics"
import EditAccountDetails from "../components/EditAccountDetails";
import Tabs from "../components/TabSystem/Tabs"
import Tab from "../components/TabSystem/Tab"

export default {
  name: "account",
  components: {
    EditAccountDetails,
    Analytics,
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