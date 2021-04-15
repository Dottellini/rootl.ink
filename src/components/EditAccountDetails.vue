<template>
  <div class="container">
    <input id="imageInput" type="file" name="avatar" @change="ConvertFileTo('image/jpeg', $event)">
    <button type="button" @click="upload">Upload</button>
    <input id="username" type="text">
    <button>Save</button>
    <!--test-->
    <canvas id="imageCanvas" hidden></canvas>
  </div>
</template>

<script>
export default {
  name: "EditAccountDetails",

  data() {
    return {
      file: ""
    }
  },

  mounted() {
    document.getElementById("username").value = this.$store.state.account_username
  },

  methods: {
    ConvertFileTo: function(outputMimeType, evt) {
      new Promise(res => {
        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (content) => {
          const img = new Image();
          img.src = content.target.result.toString();
          const canvas = document.getElementById('imageCanvas');
          img.addEventListener('load', (e) => {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);
            this.file = canvas.toDataURL(outputMimeType, 0.7)
          });
        });
        reader.readAsDataURL(file)
      });
    },

    upload: function () {
      if(this.file === "") { return }

      let data = {image: this.file}

      fetch('/uploadProfilePicture', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
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