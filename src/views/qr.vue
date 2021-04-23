<template>
  <QR_GEN></QR_GEN>
</template>

<script>
import QR_GEN from '../components/QrCodeGenerator'

export default {
  name: "QR",
  components: {
    QR_GEN
  },

  beforeCreate() {
    if(!this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  },
}
</script>

<style scoped lang="scss">

</style>