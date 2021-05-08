<template>
  <div class="container">
    <div class="image-container">
      <div class="img-container">
        <label for="imageInput" class="image-input-label">
          <img id="picPreview" :src="file" width="150" height="150">
        </label>
        <div class="middle">
          <div class="text">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </div>
        </div>
      </div>
      <input id="imageInput" type="file" name="avatar" @change="ConvertFileTo('image/jpeg', $event)" hidden>
    </div>
    <button type="button" class="upload-Button" @click="upload">{{$t('upload')}}</button>
    <input id="username" type="text">
    <button class="save-button">{{$t('save')}}</button>
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
    document.getElementById("username").value = this.$store.state.account_username;
    this.file = this.$store.state.account_profile_picture;
  },

  methods: {
    ConvertFileTo: function(id, outputMimeType, evt) {
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
            const max_size = img.height < img.width ? img.height : img.width;
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, Math.max((img.naturalWidth - max_size) / 2), Math.max((img.naturalHeight - max_size) / 2), max_size, max_size, 0, 0, img.naturalWidth, img.naturalHeight);
            this.file = canvas.toDataURL(outputMimeType, 0.7)

            //let imgData = {
            //  id: id,
            //  img: this.file
            //}
            //this.$store.commit("addImageToEntry", imgData);
          });
        });
        reader.readAsDataURL(file)
      })
    },

    /*ConvertFileTo: function(outputMimeType, evt) {
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
    },*/

    upload: function () {
      if(this.file === this.$store.state.account_profile_picture) { return }

      let data = {image: this.file}

      fetch('/uploadProfilePicture', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      }).then(()=> {})
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  align-items: center;
}

#username {
  outline: none;
}

.image-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  
  &:hover .image-input-label{
    opacity: 0.3;
  }

  &:hover .middle {
    opacity: 0.5;
  }
}

.img-container{
  position: relative;
  text-align: center;
  color: white;
}

.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  border-radius: 50%;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.text {
  color: black;
  font-size: 16px;
  padding: 32px 32px;
}

.image-input-label {
  border-radius: 50%;
  #picPreview {
    border-radius: 50%;
    opacity: 1;
    display: block;
    transition: .5s ease;
    backface-visibility: hidden;
  }
}

.save-button {
  cursor: pointer;
  background-color: #05b8a6;
  color: white;
  border: 1px solid #05b8a6;
  border-radius: 50px;
  font-size: 25px;
  margin: 10px 0;
  padding: 3px;

  &:hover {
    background-color: white;
    color: #05b8a6;
    border: 1px solid #05b8a6;
  }
}

.upload-Button {
  cursor: pointer;
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--text-color);
  border-radius: 50px;
  font-size: 0.8em;
  margin: 10px 0;

  &:hover {
    background-color: var(--text-color);
    color: var(--background-color);
    border: 1px solid var(--background-color);
  }
}


</style>