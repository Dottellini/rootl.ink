<template>
  <HorizontalChooser :options='["Option1", "Option2", "Option3"]' @optionSelection="test"></HorizontalChooser>
</template>

<script>
import Dropdown from "@/components/Dropdown";
import HorizontalChooser from "@/components/HorizontalChooser";
export default {
  components:{HorizontalChooser, Dropdown},
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