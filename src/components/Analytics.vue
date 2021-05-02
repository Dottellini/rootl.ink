<template>
  <div>
    Page Views: {{JSON.stringify(Analytics)}}
    <Chart v-if="loaded" :chartOptions="chartOptions" :series="series" />
  </div>
</template>

<script>
  import Chart from "./Chart.vue"
  export default {
    name: "Analytics",
    components:{Chart},
    data(){
      return {
        loaded: false,
        CchartOptions: undefined,
        Cseries: undefined
      }
    },
    computed:{
      chartOptions: function(){
        return this.CchartOptions
      },
      series: function(){
        return this.Cseries
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
          this.CchartOptions={
            chart: {
              id: 'vuechart-example'
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
          }
          this.Cseries=[{
            name: 'series-1',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }]
          this.loaded=true;

        });
    }
  }
</script>

<style scoped>
  div{
    background-color: aquamarine;
  }
</style>