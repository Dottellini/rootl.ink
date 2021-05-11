<template>
  <div>
    <canvas id="canvas" ></canvas>
    <button @click="GenQrCode">Generate</button>
    Xsize<input v-model="Xsize">
    Ysize<input v-model="Ysize"><br>
    Höhe*Breite<220<br>
    Höhe < 32 + Breite < 32
  <p id="warning" style="color: red; font-size: 3em"></p>

  </div>
</template>

<script>
  import GenerateQrCode from '../../qrcode-gen/GenerateQrCode.js'
  export default {
    data() {
      return {
        value: `http://localhost/${this.$store.state.account_username.toLowerCase()}`,
        QRCode: undefined,
        Xsize: undefined,
        Ysize: undefined
      }
    },
    mounted() {
      if (this.$store.state.account_username === null) {
        document.getElementById("warning").textContent = "ERST EINLOGGEN!!!"
        document.getElementById("warning").style.color = "red"
      }
    },

    methods: {
      GenQrCode: function (){
        this.Xsize = parseInt(this.Xsize)
        this.Ysize = parseInt(this.Ysize)

        console.log(this.Ysize)
        console.log(this.Xsize)

        console.log(this.Xsize>31)
        console.log(this.Ysize>31)
        console.log(this.Xsize*this.Ysize>219)

        if(this.Xsize>31 || this.Ysize>31 || this.Xsize*this.Ysize>219){
          console.log("ERROR")
          document.getElementById("warning").textContent = "ZU GROSS!!!"
          document.getElementById("warning").style.color = "red"

        }else{
          document.getElementById("warning").textContent = "Passt."
          document.getElementById("warning").style.color = "green"
        }

        let string;
        string = GenerateQrCode(this.value)
        let sides = Math.sqrt(string.length)
        const size = 15;
        let canvas = document.getElementById("canvas");
        canvas.width = sides * size
        canvas.height = sides * size
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, sides, sides);
        ctx.fillStyle = "#000";


        for (let i = 0; i < sides; i++) {
          for (let j = 0; j < sides; j++) {
            if(i>=(sides-this.Xsize)/2 && i<(sides-this.Xsize)/2+this.Xsize && j>=(sides-this.Ysize)/2 && j<(sides-this.Ysize)/2+this.Ysize){
              ctx.fillStyle = "#00F"
              ctx.fillRect(i*size, j*size, size, size );
              ctx.fillStyle ="#000"
            } else{
              if (string[i*sides+j] === '1') {
                ctx.fillRect(i*size, j*size, size, size );
              }
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>