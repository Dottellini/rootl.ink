<template>
  <div class="basic-container">
    <h2>Choose your Base Color:</h2>
    <input type="color" v-model="colorHEX" @input="change">
    <div class="border"></div>
    <h2>Choose your Text Color:</h2>
    <input type="color" v-model="textHEX" @input="changeTxt">
  </div>
</template>

<script>
export default {
  name: "ColorPickerBasic",

  data() {
    return {
      colorHEX: "#FFFFFF",
      colorHSL: "hsl(0, 0%, 100%)",
      textHEX: "#000000"
    }
  },

  methods: {
    hexToHSL() {
      let H = this.colorHEX;

      // Convert hex to RGB first
      let r = 0, g = 0, b = 0;
      if (H.length === 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
      } else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
      }
      // Then to HSL
      r /= 255;
      g /= 255;
      b /= 255;
      let cmin = Math.min(r,g,b),
          cmax = Math.max(r,g,b),
          delta = cmax - cmin,
          h = 0,
          s = 0,
          l = 0;

      if (delta == 0)
        h = 0;
      else if (cmax == r)
        h = ((g - b) / delta) % 6;
      else if (cmax == g)
        h = (b - r) / delta + 2;
      else
        h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      if (h < 0)
        h += 360;

      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      this.colorHSL= "hsl(" + h + "," + s + "%," + l + "%)";
    },

    HSLtoHEX(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    },

    createPalette() {
      let hsl = this.colorHSL.split("").slice(4);
      hsl.pop(); //remove last element of array
      hsl = hsl.join("").replace(/\s/g, '').split(",");

      let h = hsl[0];
      let s = hsl[1].replace(/%/g, '');
      let l = hsl[2].replace(/%/g, '');

      console.log(`h: ${h}, s: ${s}, l: ${l}`)

      this.$store.commit("updateBackgroundColor", this.HSLtoHEX(h, s, l - (l*0.2))) //Hier die Werte anpassen
      this.$store.commit('updateBoxColor', this.HSLtoHEX(h, s, l))

    },

    change() {
      if(this.colorHEX.toLowerCase() === "#ffffff") {
        this.$store.commit("updateBackgroundColor", "#ffffff")
        this.$store.commit('updateBoxColor', "#000000")
      } else {
        this.hexToHSL()
        this.createPalette()
      }
    },

    changeTxt() {
      this.$store.commit("updateText", this.textHEX)
      this.$store.commit("updateRootLinkColor", this.textHEX)
    }
  }
}
</script>

<style scoped lang="scss">

.basic-container {
  color: var(--text-color);
}

.border {
  margin: 10px;
  border: 1px solid var(--border-color);
  width: 100%;
}

</style>