<template>
  <div class="chart">
    <apexcharts v-if="loaded"
                id="Chart1"
                ref="Chart"
                width="300"
                height="300"
                type="bar"
                :options="options"
                :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "UltimateChart",
  data: function (){
    return {
      loaded: false,
      series: undefined,
      options: undefined
    }
  },
  props:["yAxis", "xAxis", "title"],
  components: {
    apexcharts: VueApexCharts,
  },
  mounted() {
    this.options= {
      title: {text: this.$props.title},
      chart: {
        events: {},
        id: 'Chart1'
      },
      xaxis: {
        categories: this.$props.xAxis
      }
    }
    this.series=[{
      name: '',
      data: this.$props.yAxis
    }]
    this.loaded=true
  }
};
</script>
<style scoped lang="scss">
</style>
