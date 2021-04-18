<template>
  <iframe :width=width :height=height src="https://www.youtube.com/embed/ZCbQjgcDetA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</template>

<script>
export default {
  name: "VideoEmbed",
  data() {
    return {
      width,
      height
    }
  }
}
</script>

<style scoped lang="scss">
  h1{
    color: red
  }
</style>