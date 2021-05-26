<template>
  <D3Bar :data="[
        { id: 'd1', value: 10},
        { id: 'd2', value: 11},
        { id: 'd3', value: 12},
        { id: 'd4', value: 3},
        { id: 'd5', value: 9},
        { id: 'd6', value: 3},
        { id: 'd7', value: 13},
        { id: 'd8', value: 15},
      ]" chartHeight="400px" chartWidth="700px"/>
</template>

<script>

import Chart from "@/components/Charting/Chart";
import D3Bar from "@/components/Charting/D3Bar";

export default {
  components:{D3Bar, Chart},
  name: "test",
  methods:{
    test(evt){
      console.log(evt)
    }
  },

}
</script>

<style scoped>

</style>