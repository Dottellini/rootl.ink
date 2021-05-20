<template>
  <Dropdown Options="{title: 'YouTube', img:'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png'},
        {title: 'Facebook', img:'https://cdn.icon-icons.com/icons2/2108/PNG/512/facebook_icon_130940.png'},
        {title: 'Instagram', img:'https://icoff.ee/fa/wp-content/uploads/2019/06/instagram-logo.png'}"/>

</template>

<script>
import Dropdown from "@/components/Dropdown";
export default {
  components:{Dropdown},
  name: "test"
}
</script>

<style scoped>

</style>