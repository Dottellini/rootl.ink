<template>
  <D3Bar :data="[
        { id: 'Value1', value: 10},
        { id: 'Test2', value: 20},
        { id: 'Label3', value: 30},
        { id: 'Lol4', value: 40},
        { id: 'd5', value: 50},

      ]" chartHeight="520px" chartWidth="700px"/>
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