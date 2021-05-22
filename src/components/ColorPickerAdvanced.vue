<template>
  <div class="center">

    <horizontal-chooser :options="['Single Color', 'Gradient', 'Picture']" title="Background" @optionSelection="tabChangeBG"/>
    <div id="singlebg" :class="{hidden: !(activeOptionBG==='Single Color')}">
      <div id="background-color-pickerbg" class="picker">
        <div>
          <input id="backgroundPickerbg" value="#FFFFFF" type="color" @input="updateBGColor($event.target.value)">
        </div>
      </div>
    </div>
    <div id="gradientbg" :class="{hidden: !(activeOptionBG==='Gradient')}">
      <div class="grad-container">
        <vue-gpickr class="grad-element" v-model="gradient_bg" @input="updateBGGrad()"/>
      </div>
    </div>
    <div id="picturebg" :class="{hidden: !(activeOptionBG==='Picture')}">
      Dick
    </div>

    <div class="border"></div>

    <horizontal-chooser :options="['Single Color', 'Gradient', 'Picture']" title="Linkbox" @optionSelection="tabChangeBOX"/>
    <div id="singlelnk" :class="{hidden: !(activeOptionBox==='Single Color')}">
      <div id="background-color-pickerlnk" class="picker">
        <div>
          <input id="backgroundPickerlnk" value="#FFFFFF" type="color" @input="updateBOXColor($event.target.value)">
        </div>
      </div>
    </div>
    <div id="gradientlnk" :class="{hidden: !(activeOptionBox==='Gradient')}">
      <div class="grad-container">
        <vue-gpickr class="grad-element" v-model="gradient_box" @input="updateBOXGrad()"/>
      </div>
    </div>
    <div id="picturelnk" :class="{hidden: !(activeOptionBox==='Picture')}">
      Dick
    </div>

    <div class="border"></div>
    <div class="small-color-container">
      <div class="small-color-elem">
        <h2>Text-Color:</h2>
        <div id="background-color-pickertxt" class="picker">
          <div>
            <input id="backgroundPickertxt" value="#FFFFFF" type="color" @input="updateTXTColor($event.target.value)">
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="small-color-elem">
        <h2>Username-Color:</h2>
        <div id="rootl-picker" class="picker">
          <input id="rootlPicker" value="#000000" type="color" @input="updateRLColor($event.target.value)">
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import HorizontalChooser from "./Utilities/HorizontalChooser";
import { VueGpickr, LinearGradient } from 'vue-gpickr';
export default {
  name: "ColorPickerAdvanced",
  components: {HorizontalChooser, VueGpickr},
  data() {
    return {
      activeOptionBG: "Single Color",
      activeOptionBox: "Single Color",

      gradient_bg: new LinearGradient({
        angle: 0,
        stops: [
          ['#3C70A4', 0],
          ['#FF9ED2', 1]
        ]
      }),
      gradient_box: new LinearGradient({
        angle: 120,
        stops: [
          ['#0359B5', 0],
          ['#FF32CC', 1]
        ]
      }),
    }
  },
  methods: {
    tabChangeBG(option){
      this.activeOptionBG = option
    },
    tabChangeBOX(option){
      this.activeOptionBox = option
    },

    updateBGColor: function(value) {
      this.$store.commit("updateBackgroundColor", value)
    },

    updateBGGrad: function () {
      this.$store.commit('updateBackgroundColor', this.gradient_bg.toString())
    },

    //////////////

    updateTXTColor: function (value) {
      this.$store.commit("updateTextColor", value)
    },

    //////////////

    updateBOXColor: function (value) {
      this.$store.commit("updateBoxColor", value)
    },

    updateBOXGrad: function () {
      this.$store.commit('updateBoxColor', this.gradient_box.toString())
    },

    //////////////

    updateRLColor: function (value) {
      this.$store.commit("updateRootLinkColor", value)
    },
  },
  mounted() {
    document.getElementById("backgroundPicker").value = this.$store.state.background_hex;
    document.getElementById("textPicker").value = this.$store.state.text_hex;
    document.getElementById("boxPicker").value = this.$store.state.linkBox_hex;
    document.getElementById("rootlPicker").value = this.$store.state.rootLink_hex;
  },
}
</script>

<style scoped lang="scss">

.center {
  min-width: 430px;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
}

.hidden{
  display: none;
}

.border {
  margin: 10px;
  border: 1px solid var(--border-color);
  width: 100%;
}

.small-color-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.divider {
  border-left: 1px solid white;
}

.small-color-elem {
  display: flex;
  align-items: center;
  justify-content: center;

  .picker {
    margin-left: 8px;
  }

}

</style>