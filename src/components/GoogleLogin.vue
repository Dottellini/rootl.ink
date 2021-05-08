<template>
  <div>
    <button @click="handleClickSignIn">Sign in with Google</button>
  </div>
</template>

<script>
export default {
  name: "GoogleLogin",
  methods: {
    handleClickSignIn: function() {
      try {
        fetch('/auth/google', {
          method: "POST",
          mode: "no-cors"
        }).then(result => {
        })
      } catch (error) {
        //on fail do something
        console.error(error);
        return null;
      }
    }
  }
}
</script>

<style scoped>

</style>