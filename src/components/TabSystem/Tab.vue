<template>
  <div v-show='isActive' id="Tab">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Tab",
  props: {
    title: {
      type: String,
      default: 'Tab'
    }
  },
  data () {
    return {
      isActive: true
    }
  }
}
</script>

<style scoped>
#Tab{
  flex: 2;
}
</style>