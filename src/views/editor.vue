<template>
  <div class="flex-container">
    <PageBuilder class="flex-child" />
    <Preview/>
  </div>
</template>

<script>
import PageBuilder from "../components/PageBuilder";
import Preview from "../components/Preview.vue";

export default {
  name: 'Editor',
  components: {
    PageBuilder,
    Preview
  }
}
</script>

<style scoped lang="scss">


  .flex-container{
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    display: flex;
    align-items: flex-start;

    @media screen and (max-width: 768px){
      flex-direction: column;
      align-items: center;
    }
  }

  .flex-child {
    padding: 1em;
    border-radius: 25px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .flex-child:first-child {
    margin-right: 1em;

    @media screen and (max-width: 768px){
      margin: 1em 0;
    }
  }
</style>
