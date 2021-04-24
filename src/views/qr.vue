<template>
  <div>
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{this.value}}">
  </div>
</template>

<script>

  export default {
    data() {
      return {
        value: 'https://example.com',
        size: 300,
        QRCode: undefined
      }
    },
    components: {
    },
  }
</script>

<style scoped lang="scss">

</style>