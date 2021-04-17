<template>
  <div id="pageBuilder" class="container">
    <h1>Design your Page</h1>
    <tabs>
      <tab title="rootlinks">
        <draggable :list="list"
            :disabled="!enabled"
            :animation="200"
            handle=".handle"
            class="list-group"
            ghost-class="ghost"
            drag-class="drag"
            chosen-class="chosen"
            fallbackClass="sortable-fallback"
            @start="dragging = true">
          <div class="list-group-item" v-for="element in list" :key="element.id">
            <div class="horizontal-container">
              <div class="handle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                  <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </div>
              <div>
                <input type="file" :id="element.id" accept="image/*" @change="changeImage(element.id, 'image/jpeg', $event)" hidden>
                <label :for="element.id" class="upload-image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </label>
              </div>
              <div>
                <div>
                  <input type="text" class="form-control" v-model="element.name" placeholder="Name" maxlength="30">
                </div>
                <div>
                  <input type="text" class="form-control" v-model="element.link" placeholder="URL"/>
                </div>
                <img src="../assets/embed.png" width="20px" height="20px" @click="x=0"/>
              </div>
            </div>
            <button class="delete-button" @click="removeEntry(element.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </draggable>
        <button @click="addField" class="plus-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
          </svg>
        </button>
      </tab>
      <tab title="Colors">
        <div class="color-container">
          <div id="background-color-picker" class="picker">
            <label for="backgroundPicker">Background-Color:</label>
            <input id="backgroundPicker" value="#FFFFFF" type="color" @input="updateBGColor($event.target.value)">
          </div>
          <div id="text-color-picker" class="picker">
            <label for="textPicker">Text-Color:</label>
            <input id="textPicker" value="#FFFFFF" type="color" @input="updateTXTColor($event.target.value)">
          </div>
          <div id="box-color-picker" class="picker">
            <label for="boxPicker">Link-Background-Color:</label>
            <input id="boxPicker" value="#000000" type="color" @input="updateBOXColor($event.target.value)">
          </div>
          <div id="rootl-picker" class="picker">
            <label for="rootlPicker">rootl.ink-Color:</label>
            <input id="rootlPicker" value="#000000" type="color" @input="updateRLColor($event.target.value)">
          </div>
        </div>
      </tab>
    </tabs>
    <hr>
    <button @click="submit" class="save-button">Save</button>
    <canvas id="imageCanvas" hidden></canvas>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Tab from "./tab-system/Tab";
import Tabs from "./tab-system/Tabs";

export default {
  name: "simple",
  display: "Simple",
  file: "",
  order: 0,
  components: {
    draggable,
    Tab,
    Tabs
  },

  data() {
    return {
      editModeActive: false,
      enabled: true,
      dragging: true,
      //list: this.$store.state.list,
    };
  },

  computed: {
    list() {
      return this.$store.state.list
    }
  },

  mounted() {
    document.getElementById("backgroundPicker").value = this.$store.state.background_hex;
    document.getElementById("textPicker").value = this.$store.state.text_hex;
    document.getElementById("boxPicker").value = this.$store.state.linkBox_hex;
    document.getElementById("rootlPicker").value = this.$store.state.rootLink_hex;
  },

  methods: {
    submit: function () {
      this.$store.dispatch("savePage", this.$store.state)
    },

    changeImage: function(id, outputMimeType, evt) {
      console.log(id)
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

            let imgData = {
              id: id,
              img: this.file
            }
            this.$store.commit("addImageToEntry", imgData);
          });
        });
        reader.readAsDataURL(file)
      })
    },

    updateBGColor: function(value) {
      this.$store.commit("updateBackgroundColor", value)
    },

    updateTXTColor: function (value) {
      this.$store.commit("updateTextColor", value)
    },

    updateBOXColor: function (value) {
      this.$store.commit("updateBoxColor", value)
    },

    updateRLColor: function (value) {
      this.$store.commit("updateRootLinkColor", value)
    },

    removeEntry: function (id) {
      this.$store.commit("removeEntry", id)
    },

    addField: function() {
      this.$store.commit("emptyEntry")
    }
  }
};
</script>

<style scoped lang="scss">
  Input[type="color"] {
    border:none;
    background-color: var(--surface-color);
    outline: none;
  }

  .upload-image {
    background: var(--upload-background-color);
    color: var(--upload-color);
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
  }

  .color-container {
    display: flex;
    flex-direction: column;
    margin-top: 2em;
    font-family: 'Montserrat', sans-serif;

    .picker {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .container {
    color: var(--text-color);
    background-color: var(--surface-color);
  }

  .list-group-item {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 400px;
    margin: 10px auto;
    padding: 10px;
    border-radius: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    border: var(--editor-items-border);

    .horizontal-container {
      display: flex;
      justify-content: center;
      align-items: center;

      div {
        margin: 0 0.3em;
      }

      .handle {
        margin: 0;
        padding: 15% 0;
        cursor: grab;
      }
    }

  }

  .save-button {
    outline: none;
    border: 1px solid #536cc0;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: var(--background-color);
    background-color: #536cc0;
    border-radius: 50px;
    padding: 0.2em 1.2em;
    cursor: pointer;

    &:hover {
      background: var(--background-color);
      color: #536cc0;
      border: 1px solid #536cc0;
    }
  }

  .delete-button {
    padding: 0.3em 0.7em;
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: #e74c3c;
    color: white;
  }

  .submit-button {
    background: #536cc0;
    color: white;
    border-radius: 25px;
    outline: none;
    border: none;
    padding: 10px 15px ;
  }

  .plus-button {
    margin-top: 1em;
    cursor: pointer;
    border: none;
    border-radius: 50%;
    color: #03dac5;
    background: none;
    outline: none;
  }

  .form-control{
    background-color: var(--surface-color);
    color: var(--text-color);
    outline: none;
    margin: 10px 0;
    border: none;
    border-bottom: 2px solid #536cc0;
  }


  .chosen {
    opacity: 1;
  }
  .ghost {
    opacity: 0;
    background: var(--ghost-color);
  }
  .drag {
    opacity: 1;
  }

</style>