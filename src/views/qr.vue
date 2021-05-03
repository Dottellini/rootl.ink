<template>
  <canvas id="canvas" width="500px" height="500px"></canvas>
</template>

<script>
  import GenerateQrCode from '../../qrcode-gen/GenerateQrCode.js'
  export default {
    data() {
      return {
        value: 'test',
        QRCode: undefined
      }
    },
    components: {
    },
    mounted: function(){
      var string
      for(var i=40;i>0;i--){
        try{
          string = GenerateQrCode("http://localhost/timm",i);
        }catch{
          string = GenerateQrCode("http://localhost/timm",i+1);
          break;
        }
      }
      var sides = Math.sqrt(string.length)
      var width = 5
      var ctx = document.getElementById("canvas").getContext('2d');
      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, sides, sides);
      ctx.fillStyle = "#000";
      for (var i = 0; i < sides; i++) {
        for (var j = 0; j < sides; j++) {
          if (string[i*sides+j] == '1')
            ctx.fillRect(i*width, j*width, width, width );
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>