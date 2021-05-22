<template>
  <VideoEmbedModal :shown="true"></VideoEmbedModal>

</template>

<script>
import Dropdown from "@/components/Utilities/Dropdown";
import HorizontalChooser from "@/components/Utilities/HorizontalChooser";
import VideoEmbedModal from "@/components/EditorModals/VideoEmbedModal";
export default {
  components:{VideoEmbedModal, HorizontalChooser, Dropdown},
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