<template>
  <div>
    Page Views: {{JSON.parse(Analytics).Item.pageViews.N}}
  </div>
</template>

<script>
  export default {
    name: "Analytics",
    data(){
      return {
        Analytics: Object
      }
    },
    created(){
      fetch(`/analyticstimm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: "cors"
      }).then(response => response.json())
        .then(data => this.Analytics = data);
    }
  }
</script>

<style scoped>
  div{
    background-color: aquamarine;
  }
</style>