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
      if(input.files.length === 0) { return }

      let data = new FormData();
      data.append("name", input.files[0].name)
      data.append("file", input.files[0])

      fetch('/uploadProfilePicture', {
        method: 'POST',
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: data
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