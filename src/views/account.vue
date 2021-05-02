<template>
  <Tabs>
    <Tab title="Account" class="tab">
      <EditAccountDetails></EditAccountDetails>
    </Tab>
    <Tab title="Analytics" class="tab">
      <Analytics></Analytics>
    </Tab>
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
      this.$router.push({name: "Login"})
    }
  }
}
</script>

<style scoped lang="scss">
  .tab {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin: 0 3em;
  }
</style>