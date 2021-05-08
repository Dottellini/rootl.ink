<template>
  <div class="chart">
    <apexcharts id="primaryChart"
        ref="Chart1"
        width="300"
        height="300"
        type="bar"
        :options="options"
        :series="series"
    ></apexcharts>
    <apexcharts id="secondaryChart"
        ref="Chart2"
        width="300"
        height="300"
        type="bar"
        :options="options2"
        :series="series2"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "BetterChart",
  props:["options","series"],
  components: {
    apexcharts: VueApexCharts,
  },
  data: function (){
    return {
      /*
      options:{
        title: {text: "Links"},
        chart: {
          events: {},
          type: 'bar',
          horizontal: true,
          background:'#FDE',
          id: 'LickClicks1-Chart'
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        xaxis: {
          categories: ["ID1", "ID2", "ID3", "ID4", "ID5"]
        }
      },
      options2:{
        title: {text: "Days"},
        chart: {
          events: {},
          type: 'line',
          background:'#DFE',
          id: 'LickClicks2-Chart'
        },
        plotOptions: {
        },
        xaxis: {
          categories: ["Mo","Di","Mi","Do","Fr","Sa","So"]
        }
      },
      series:[{
        name: 'Link1',
        data: [30, 40, 45, 50, 49]
      }],
      series2:[{
        name: 'Link2',
        data: undefined
      }]
       */
    }
  },
  methods:{
    setEvents: function (){
      let instance = this;
      $props.options.chart.events.dataPointSelection = function (event, chartContext, {seriesIndex, dataPointIndex, config}) {
        if(document.getElementById("secondaryChart").classList.contains("clicked")) {
          document.getElementById("secondaryChart").classList.remove("clicked")
        }else{
          document.getElementById("secondaryChart").classList.add("clicked")
        }
        let newData = [Math.round(instance.series[0].data[dataPointIndex]/3),Math.round(instance.series[0].data[dataPointIndex]/3*2)]
        instance.$refs["Chart2"].updateSeries([{
          name: 'Link1',
          data: newData
        }])
      }
      this.$refs["Chart1"].updateOptions(this.options)
    }
  },
  mounted() {
    this.setEvents()
  }
};
</script>
<style scoped lang="scss">
#secondaryChart{
  transition: transform 0.8s;
  //transition-timing-function: linear
}
#secondaryChart:not(.clicked){
  z-index: -10000000;
  transform: translate(-300px,0);
}
#secondaryChart.clicked {
  z-index: -10000000;
  transform: translate(0px,0);
}

.chart{
  display: flex;
  flex-direction: row;
}
</style>
