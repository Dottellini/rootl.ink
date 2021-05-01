<template>
  <div>
    Page Views: {{JSON.stringify(Analytics)}}
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
      fetch(`/api/analytics/get/timm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: "cors"
      }).then(response => response.json())
        .then(data => {
          this.Analytics = data
          console.log(data)
        });
    }
  }
</script>

<style scoped>
  div{
    background-color: aquamarine;
  }
</style>