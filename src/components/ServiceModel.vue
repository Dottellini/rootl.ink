<template>
  <div class="container">
    <h1>{{header}}</h1>
    <div v-for="element in basic_data" :key="`basic-${index}`" class="basic-element element">{{element}}</div>
    <div v-for="element in premium_data" :key="`basic-${index}`" class="premium-element element">{{element}}</div>
  </div>
</template>

<script>
export default {
  name: "ServiceModel",
  props: ["basicData", "premiumData", "header"],
  data() {
    return {
      basic_data: this.basicData,
      premium_data: this.premiumData
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px 0;
    border-radius: 25px;
    padding: 0 2.5em 2em 2.5em;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    background-color: var(--surface-color);
    color: var(--text-color);
    font-family: 'Montserrat', sans-serif;
    h1 {
      border-bottom: 1px solid var(--text-color);
    }

    @media screen and (max-width: 768px) {
      margin: 5px;
    }
  }

  .element{
    padding: 10px;
    margin: 5px 0;
    border-radius: 25px;
  }

  .basic-element {
    background-color: var(--free-element-color);
    border: 1px solid var(--free-element-border-color);
  }

  .premium-element {
    color: white;
    background-color: #3d3d60;
    border: 1px solid #3d3d60;
  }
</style>