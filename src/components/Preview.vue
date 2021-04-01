<template>
  <div id="preview">
    <h1>rootl.ink/USERNAME</h1>
    <img src="https://de.meming.world/images/de/thumb/b/bc/Mike_Wazowski-Sulley_Face_Swap.jpg/300px-Mike_Wazowski-Sulley_Face_Swap.jpg" width="100" height="100">
    <div id="links">
      <div v-for="link in links">
        <div class="linkBox" v-if="link.name !== ''">
          <img :src='link.img' height="20px" width="20px">
          <a target="_blank" :href="link.link">{{link.name}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Preview",
  data() {
    return{
      links: this.$store.state.list
    }
  }
}
</script>

<style scoped lang="scss">
  .linkBox {
    background-color: black;
    margin: 10px auto;
    max-width: 250px;
    padding: 15px 0 15px 0;
    border-radius: 25px;

    img {
      top: 50%;
      margin-left: 20px;
      float: left;
    }
    a{
      color: white;
      text-decoration: none;
    }
  }

  img{
    border-radius: 50px;
  }
</style>