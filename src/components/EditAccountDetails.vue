<template>
  <div class="container">
    <input id="imageInput" type="file">
    <button type="button" @click="upload">Upload</button>
    <input id="username" type="text">
    <button>Save</button>
  </div>
</template>

<script>
export default {
  name: "EditAccountDetails",

  mounted() {
    document.getElementById("username").value = this.$store.state.account_username
  },

  methods: {
    upload: function () {
      let input = document.getElementById("imageInput")
      if(input.value.length === 0) { return }

      fetch('/uploadProfilePicture', {
        method: 'POST',
        body: input.files[0]
      }).then(response => {
        console.log(response)
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: flex-start;
  font-family: 'Montserrat', sans-serif;
}

</style>