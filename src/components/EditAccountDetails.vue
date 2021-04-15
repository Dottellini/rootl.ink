<template>
  <div class="container">
    <form method="POST" action="/uploadProfilePicture" enctype="multipart/form-data">
      <input id="imageInput" type="file" name="avatar">
      <input type="submit" name="submit-Button" value="Upload">
    </form>
    <!--
    <input id="imageInput" type="file" name="avatar">
    <button type="button" @click="upload">Upload</button>-->
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
      console.log(input.files[0])

      let f = (URL || webkitURL).createObjectURL(input.files[0]);
      let form = new FormData();
      form.append("file", f)

      fetch('/uploadProfilePicture', {
        method: 'POST',
        body: form
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