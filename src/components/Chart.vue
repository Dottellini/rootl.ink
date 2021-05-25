<template>
  <div>
    <VueApexCharts :width="chartWidth" :height="chartHeight" type="bar" :options="options" :series="series"></VueApexCharts>
  </div>
</template>

<script>

import VueApexCharts from 'vue-apexcharts'

export default {
  name: "Chart",
  props:['xAxis', 'yAxis', 'chartHeight', 'chartWidth'],
  components:{VueApexCharts},
  data: function() {
    return {
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: this.$props.xAxis
        }
      },
      series: [{
        name: 'series-1',
        data: this.$props.yAxis
      }]
    }
  }
}

</script>

<style scoped>

</style>