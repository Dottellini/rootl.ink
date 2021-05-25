<template>
  <Chart/>
</template>

<script>

import Chart from "@/components/Chart";

export default {
  components:{Chart},
  name: "test",
  methods:{
    test(evt){
      console.log(evt)
    }
  }
}
</script>

<style scoped>

</style>