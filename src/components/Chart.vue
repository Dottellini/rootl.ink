<template>
  <div class="example">
    <apexcharts
      width="1500"
      height="600"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Chart",
  components: {
    apexcharts: VueApexCharts,
  },
  props:["chartOptions","series"]
};
</script>
