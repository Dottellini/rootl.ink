<template>
  <div id="QrCode">
    <script type="text/javascript" src="../qrcode-gen/GenerateQrCode.js"></script>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        value: 'test',
        QRCode: undefined
      }
    },
    components: {
    },
    mounted: {
      function(){
        GenerateQrCode("value",20)
      }
    }
  }
</script>

<style scoped lang="scss">

</style>