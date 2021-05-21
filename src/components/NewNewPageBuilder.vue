<template>
  <div id="pageBuilder">
    <canvas id="imageCanvas" style="display:none;"></canvas>
    <Sidebar @itemClick="tabChange"/>
    <div id="editArea">
      <div id="Rootlinks" :class="{hidden: !(activeTab==='Rootlinks')}">
        <h2 class="text">Rootlinks:</h2>
        <draggable :list="list" :disabled="!enabled" :animation="200" handle=".handle" class="list-group" ghost-class="ghost" drag-class="drag" chosen-class="chosen" fallbackClass="sortable-fallback" @start="dragging = true">
          <div class="list-group-item" v-for="element in list" :key="element.id">
            <div class="handle">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </div>
            <img class="iconImg" :src="file[element.id]" alt="" :class="{hidden: file[element.id]===undefined}">
            <div class="list-group-item-description">
              <p class="linkTitle" >{{element.title}}</p>
              <p class="linkDescription">{{element.url}}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="16" fill="currentColor" class="bi bi-box-arrow-right modalArrow" viewBox="0 0 16 16" @click="toggleSettingsModal('link',element)">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>

            <!-- The Modal -->
            <div class="modal" :class="{hidden: modalHidden.link}" @click="modalClick($event, element)">
              <!-- Modal content -->
              <div class="modalContent">
                <div class="verticalContainer">
                  <div class="horizontalContainer">
                    <div class="titleUrlSettings">
                      <h2>Content</h2>
                      <div>
                        <label>Title</label>
                        <TextInput title="Title" :value="currentSettings.name" placeholder="My Awesome Link" v-model="currentSettings.name"></TextInput>
                      </div>
                      <div>
                        <TextInput title="Url" :value="currentSettings.link" placeholder="https://www.example.com" v-model="currentSettings.link"></TextInput>
                      </div>
                      <div>
                        <CheckBox text="Embed Video" class="CheckBox"></CheckBox>
                      </div>
                    </div>
                    <div class="iconSettings">
                        <h2>Icon</h2>
                        <CustomButton type="button" @click="getFavicon(element.url, element.id)">Get Website Icon</CustomButton>
                        <CustomButton type="fileSelector" :bindId="element.id" @fileSelected="changeImage">Upload Own Icon</CustomButton>
                    </div>
                    <span class="close" @click="toggleSettingsModal('link',element)">&times;</span>

                  </div>
                  <div class="horizontalContainer last">
                    <CustomButton type="button" @click="removeEntry('link') ;toggleSettingsModal('link',element)">Delete Link</CustomButton>
                    <CustomButton type="button" @click="toggleSettingsModal('link',element)">Save</CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </draggable>
        <button @click="addField('link')" class="Add-Button">Add Link</button>
      </div>
      <div id="SocialIcons" :class="{hidden: activeTab !== 'Social Icons'}">
        <h2 class="text">Social Media Icons:</h2>
        <draggable :list="socialsList" :disabled="!enabled" :animation="200" handle=".handle" class="list-group" ghost-class="ghost" drag-class="drag" chosen-class="chosen" fallbackClass="sortable-fallback" @start="dragging = true">
          <div class="list-group-item" v-for="element in socialsList" :key="element.id">
            <div class="handle">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </div>
            <img class="iconImg" :src="file[element.id]" alt="" :class="{hidden: file[element.id]===undefined}">
            <div class="list-group-item-description">
              <p class="linkTitle" >{{element.title}}</p>
              <p class="linkDescription">{{element.link}}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="18" fill="none" viewBox="0 0 10 18" @click="toggleSettingsModal('social',element)">
              <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"/>
            </svg>
            <!-- The Modal -->
            <div class="modal" :class="{hidden: modalHidden.social}" @click="modalClick($event, element)">
              <!-- Modal content -->
              <div class="modalContent">
                <div class="modalContainer">
                  <div class="platformSelector">
                    <p class="platformSelector">Select Your Platform:</p>
                    <Dropdown Options="{title: 'YouTube', img:'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png'},
                    {title: 'Facebook', img:'https://cdn.icon-icons.com/icons2/2108/PNG/512/facebook_icon_130940.png'},
                    {title: 'Instagram', img:'https://icoff.ee/fa/wp-content/uploads/2019/06/instagram-logo.png'}"/>
                  </div>
                  <div class="handleInput">
                    <p class="handleInput">Your handle:</p>
                    <TextInput placeholder="@username || youtube.com/c/username"></TextInput>
                  </div>
                  <CustomButton type="button" @click="removeEntry('social') ;toggleSettingsModal('social',element)">Delete Link</CustomButton>
                  <CustomButton type="button" @click="toggleSettingsModal('social',element)">Save</CustomButton>
                </div>
              </div>
            </div>
          </div>
        </draggable>
        <button @click="addField('social')" class="Add-Button">Add Link</button>
      </div>
      <div id="color" :class="{hidden: activeTab !== 'Colors'}">
        <input type="checkbox" id="modeSelector" v-model="advancedMode">
        <label for="modeSelector">Advanced</label>
        <div v-if="!advancedMode">
          <color-picker-basic></color-picker-basic>
        </div>
        <div v-if="advancedMode">
          <color-picker-advanced></color-picker-advanced>
        </div>
      </div>
    </div>
    <slot id="Preview"></slot>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import draggable from "vuedraggable";
import { VueGpickr, LinearGradient } from 'vue-gpickr';
import CheckBox from "@/components/CheckBox";
import TextInput from "@/components/TextInput";
import CustomButton from "@/components/CustomButton";
import Dropdown from "@/components/Dropdown";
import HorizontalChooser from "./HorizontalChooser";
import ColorPickerBasic from "./ColorPickerBasic";
import ColorPickerAdvanced from "./ColorPickerAdvanced";


export default {
  name: "PageBuilder",
  components: {
    ColorPickerAdvanced,
    ColorPickerBasic,
    HorizontalChooser, Dropdown, CustomButton, TextInput, CheckBox, Sidebar, draggable, VueGpickr},
  data(){
    return{
      modalHidden: {
        link: true,
        social: true
      },
      advancedMode: false,
      activeTab: 'Rootlinks',
      file: {},
      currentSettings: {},

      //OLD
      activeTypeSelectorItem: {
        Background:0,
        Links:0
      },
      highlighted: "Rootlinks",
      editModeActive: false,
      enabled: true,
      dragging: true,
      show_bg_grad: false,
      show_link_grad: false,
      gradient_bg: new LinearGradient({
        angle: 0,
        stops: [
          ['#3C70A4', 0],
          ['#FF9ED2', 1]
        ]
      }),
      gradient_box: new LinearGradient({
        angle: 120,
        stops: [
          ['#0359B5', 0],
          ['#FF32CC', 1]
        ]
      }),
    }
  },
  methods:{
    modalClick(evt, linkItem){
      if(evt.target.outerHTML.includes('class="modal"')){
        this.toggleSettingsModal(undefined, linkItem)
      }
    },
    toggleSettingsModal(linkType, linkItem){
      this.currentSettings = linkItem
      this.modalHidden[linkType] = !this.modalHidden[linkType]},
    tabChange(item){this.activeTab = item.title},
    getFavicon: function(url, id) {
      fetch(`gethtml?url=${url}`,{
        method:"POST"
      }).then(htmlData=>htmlData.text()).then(htmlString=>{
        let foundIconPosition = htmlString.search(RegExp('(<link rel="(icon|apple-touch-icon-precomposed|shortcut icon|shortcut-icon)")|apple-touch-icon'))
        if(foundIconPosition===-1){
          let imgData = {
            id: id,
            img: undefined
          }
          this.$store.commit("addImageToEntry", {imgData, type: 'link'});
          return;
        }
        htmlString = htmlString.slice(foundIconPosition, foundIconPosition+300)
        htmlString = htmlString.split(RegExp('[<>\\s]'))

        for(let i=0;i<htmlString.length;i++){
          if(htmlString[i].includes('href=')){
            htmlString = htmlString[i].replace('href="','').replace('"','')
            if(htmlString[htmlString.length-1]==="/"){
              htmlString = htmlString.slice(0,htmlString.length-1)
            }
            break;
          }
        }
        if(htmlString[0]==='/'){
          htmlString = `https://${url.split('/')[2]}${htmlString}`
        }

        let imgData = {
          id: id,
          img: htmlString
        }
        this.$store.commit("addImageToEntry", {imgData, type: 'rootlink'});
        this.file[id] = htmlString
      })
    },
    checkIfVideo: function (id, url) {
      if(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?|http(?:s?):\/\/(www\.)?vimeo\.com\/(\d+)|http(?:s?):\/\/(?:www\.)twitch.tv\/(\S+)/g.test(url)){
        this.$store.commit("isYoutubeVideo", {id: id, result: true});
        return
      }
      this.$store.commit("isYoutubeVideo", {id: id, result: false});
    },
    submitPage: function () {
      this.$store.dispatch("savePage", this.$store.state)
    },
    changeImage(eventParams){
      new Promise(res => {
        let file = eventParams.evt.target.files[0];
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
            this.file[this.currentSettings.id] = canvas.toDataURL(this.currentSettings.id.outputMimeType, 0.7)

            let imgData = {
              id: eventParams.id,
              img: this.file[this.currentSettings.id]
            }

            this.$store.commit("addImageToEntry", {imgData, type: 'rootlink'});
          });
        });
        reader.readAsDataURL(file)
      })
    },
    updateColor(type, value){
      this.$store.commit(type, value)

    },
    /*
    updateBGColor: function(value) {
      this.$store.commit("updateBackgroundColor", value)
    },
    updateBGGrad: function () {
      this.$store.commit('updateBackgroundColor', this.gradient_bg.toString())
    },
    updateTXTColor: function (value) {
      this.$store.commit("updateTextColor", value)
    },
    updateBOXColor: function (value) {
      this.$store.commit("updateBoxColor", value)
    },
    updateBOXGrad: function () {
      this.$store.commit('updateBoxColor', this.gradient_box.toString())
    },
    updateRLColor: function (value) {
      this.$store.commit("updateRootLinkColor", value)
    },
    */
    removeEntry: function (type) {
      let id = this.currentSettings.id
      this.$store.commit("removeEntry", {id,type})
    },
    addField: function(type) {
      this.$store.commit("emptyEntry", type)
    }
  },
  computed:{
    list() {
      return this.$store.state.linkList
    },
    socialsList() {
      return this.$store.state.socialsList
    }
  },
  beforeCreate() {
    document.documentElement.style.overflow = 'hidden'
  },
  destroyed() {
    document.documentElement.style.overflow = 'auto';
  }
}
</script>

<style scoped>

label, h2 {
  color: var(--text-color);
}

input[type=checkbox] {
  margin: .4rem;
}

p.platformSelector{
  line-height: 35px;
  margin-right: 10px;
}

p.handleInput{
  line-height: 49px;
  margin: 0 10px 0 0;
}

.platformSelector, .handleInput{
  margin:0 auto 0 auto;
  display: flex;
  flex-direction: row;
}

.dropdown{
  margin: 0 auto 0 auto;
}

.modalContainer{
  display: flex;
  flex-direction: column;
  width: 100%;
}

.CheckBox{
  font-family: Montserrat, sans-serif;
  font-weight: 500;
}

.modalArrow {
  color: var(--text-color);
  cursor: pointer;
}

/* The Modal (background) */
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  margin: 0;
  align-items: center;
}

/* Modal Content/Box */
.modalContent {
  color: var(--text-color);
  background-color: var(--background-color);
  margin: 5% auto 5% auto; /* 15% from the top and centered */
  padding: 10px;
  border-radius: 10px;
  width: 800px; /* Could be more or less, depending on screen size */
  height: 400px;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  max-height:25px;
}

.close:hover,
.close:focus {
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
}

.verticalContainer{
  width: 100%;
  display: flex;
  justify-content:space-between;
  flex-direction: column;
}

.horizontalContainer{
  display: flex;
  flex-direction: row;
  height: 10000px;

}

.horizontalContainer.last{
  border-top: 1px solid var(--border-color);
  justify-content: space-around;
  min-height: 35px;
  max-height: 35px;
  display: flex;
  flex-direction: row;
}

.iconSettings{
  color: var(--text-color);
  border-left: 1px solid var(--border-color);
  width: 1000px;
}

.titleUrlSettings{
  width: 1000px;
}

.list-group-item-description{
  width: 10000px;
}

.linkTitle{
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  margin: 10px 10px 10px 10px;
  text-align: left;
}
.linkDescription{
  font-family: Montserrat, sans-serif;
  margin: 10px 10px 10px 10px;
  text-align: left;
}

label{
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  font-weight: 500;

}

input{
  outline: none;
  color: var(--text-color);
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  margin: 0.5em 0;
  padding: 0.1em 1em;
  border-radius: 50px;
  background-color: var(--background-color);
  border: 1px solid var(--text-color);
}

.hidden{
  display: none;
}

.no-scroll{
  overflow-y: hidden !important;
}

#pageBuilder{
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  border-radius: 0;
  padding: 0;
  margin: auto;
}

#editArea{
  /*width: 10000px;*/
  height: 10000px;
  background-color: var(--background-color);
}

.iconImg{
  margin: 0 0 0 0;
  width: 64px;
  min-width: 64px;
  height: 64px;
  border-radius: 32px;
}

.list-group-item {
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  height: 84px;
  margin: 10px auto;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  border: var(--editor-items-border);
}
</style>

<style scoped lang="scss">

.text {
  font-family: 'Montserrat', sans-serif;
  color: var(--text-color);
}

.typeSelector{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin:10px auto;
  width:400px;
  height: 20px;
  border: 1px solid black;
  border-radius: 10px;

  .typeSelectorItem{
    flex-grow: 9999999;
  }

  .typeSelectorItem.last{
    border-radius: 0 9px 9px 0;
  }

  .typeSelectorItem.first{
    border-radius: 9px 0 0 9px;
  }

  .typeSelectorItem.active{
    background-color: #009a9a;

  }
  .typeSelectorItem:hover{
    background-color: #00cfcf;
    cursor: pointer;
  }
}

.Add-Button{
  color: var(--text-color);
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 6px 12px 6px 12px;
  font-size: 1em;

  &:hover{
    cursor: pointer;
    background-color: var(--background-color);
    color: var(--text-color);
  }
}

.ContentWrapper{
  position: relative;
  height: 100%;
  display: flex;
  align-items: stretch;
  flex-direction: row;
}

Input[type="color"] {
  border:none;
  background-color: var(--surface-color);
  outline: none;
  cursor: pointer; //test
}

.grad-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .grad-element {
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }
}

.upload-image {
  background: var(--upload-background-color);
  color: var(--upload-color);
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

.embed {
  color: var(--text-color);
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
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

  width: calc(100vw - 410px);
  height: calc(100vh - 120px);
  color: var(--text-color);
  background-color: var(--surface-color);
}

  .horizontal-container {
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      margin: 0 0.3em;
    }
  }

.handle {
  color: var(--text-color);
  margin: 0;
  padding: 15% 0;
  cursor: grab;
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
  opacity: 100;
  background: var(--ghost-color);
}
.drag {
  opacity: 0;
}

</style>
