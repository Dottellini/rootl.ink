<template>
  <D3Bar :data="[{ x: 'Value1', y: Math.round(Math.random()*130)},
        { x: 'Value2', y: Math.round(Math.random()*100)},
        { x: 'Value3', y: Math.round(Math.random()*100)},
        { x: 'Value4', y: Math.round(Math.random()*100)},
        { x: 'Value5', y: Math.round(Math.random()*100)},
        { x: 'Value6', y: Math.round(Math.random()*100)},
        { x: 'Value7', y: Math.round(Math.random()*100)},
        { x: 'Value8', y: Math.round(Math.random()*100)},
        { x: 'Value9', y: Math.round(Math.random()*100)},]"
        chartHeight="900px" chartWidth="1000px" title="Test"/>
</template>

<script>

import D3Bar from "@/components/Charting/D3Bar";

export default {
  components:{D3Bar},
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