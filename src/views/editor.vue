<template>
  <div class="flex-container">
    <PageBuilder class="flex-child" />
    <Preview class="flex-child" />
  </div>
</template>

<script>
import PageBuilder from "../components/PageBuilder";
import Preview from "../components/Preview.vue";

export default {
  name: 'PageDesigner',
  components: {
    PageBuilder,
    Preview
  }
}
</script>

<style scoped lang="scss">
  .flex-container{
    display: flex;
    align-items: flex-start;
  }

  .flex-child {
    padding: 10px;
    flex: 1;
    border-radius: 25px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .flex-child:first-child {
    margin-right: 20px;
  }
</style>
