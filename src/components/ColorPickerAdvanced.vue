<template>
  <div>
    <h1>This is advanced</h1>
    <horizontal-chooser :options="['Single Color', 'Gradient', 'Picture']"></horizontal-chooser>
    <div id="single" :class="{hidden: !(activeOption==='Single Color')}">
      GAY
    </div>
    <div id="gradient" :class="{hidden: !(activeOption==='Gradient')}">
      Nigga
    </div>
    <div id="picture" :class="{hidden: !(activeOption==='Picture')}">
      Dick
    </div>
  </div>
</template>

<script>
import HorizontalChooser from "./HorizontalChooser";
export default {
  name: "ColorPickerAdvanced",
  components: {HorizontalChooser}
}
</script>

<style scoped lang="scss">

.hidden{
  display: none;
}
</style>