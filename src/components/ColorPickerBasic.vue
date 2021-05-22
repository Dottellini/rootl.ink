<template>
  <div class="basic-container">
    <h1>This is basic</h1>
    <input type="color" v-model="color" @input="change">
  </div>
</template>

<script>
export default {
  name: "ColorPickerBasic",

  data() {
    return {
      color: "#FFFFFF"
    }
  },

  methods: {
    change() {
      console.log(this.color)
    }
  }
}
</script>

<style scoped lang="scss">

.basic-container {
  color: var(--text-color);
}

</style>