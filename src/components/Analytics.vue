<template>
  <div>
    Page Views: {{JSON.stringify(Analytics)}}
    <LineChart/>
  </div>
</template>

<script>
import LineChart from "./LineChart.vue"
  export default {
    name: "Analytics",
    components:{LineChart},
    data(){
      return {
      chartData: {
        Books: 24,
        Magazine: 30,
        Newspapers: 10
      },
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