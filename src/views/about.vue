<template>
  <div @click="clickyTest()">
      About
  </div>
</template>

<script>

export default {
  name: "About",
  methods:{
    clickyTest: function(){
      var clicky_custom = {};
      clicky_custom.href = '/some/page?some=query';
      clicky_custom.title = 'Some page';
      clicky_custom.session = {
        username: 'bobjones',
        email: 'bob@jones.com'
      };
      clicky_custom.timer = 200;
    }
  }
}
</script>

<style scoped lang="scss">

</style>