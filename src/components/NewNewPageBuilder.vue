<template>
  <div id="pageBuilder">
    <button @click="submit"></button>
    <div class="modal closeItem" :class="{hidden: modalHidden.rootlink && modalHidden.videoEmbed && modalHidden.social}" @click="modalClick($event, currentSettings)"></div>
    <canvas id="imageCanvas" style="display:none;"></canvas>
    <Sidebar @itemClick="tabChange"/>
    <div id="editArea">
      <div id="Rootlinks" :class="{hidden: activeTab!=='Rootlinks'}">
        <h2 class="text">Rootlinks:</h2>
        <draggable :list="list" :disabled="!enabled" :animation="100" handle=".handle" class="list-group" ghost-class="ghost" drag-class="drag" chosen-class="chosen" fallbackClass="sortable-fallback" @start="dragging = true">
          <div class="list-group-item" v-for="element in list" :key="element.id">
            <RootlinksModal
                :title="element.title"
                :url="element.url" :id="element.id"
                :shown="!modalHidden.rootlink && currentSettings.id === element.id"
                @close="toggleSettingsModal(undefined, element)"
                @remove="removeEntry('rootlink')"
                @urlInput="function (evt){element.url = evt}"
                @titleInput="function (evt){element.title = evt}"
                @newIcon="changeImage"
            ></RootlinksModal>
            <div class="handle">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </div>
            <img class="iconImg" :src="file[element.id]" alt="" :class="{hidden: file[element.id]===undefined}">
            <div class="list-group-item-description">
              <p class="linkTitle" >{{element.title}}</p>
              <p class="linkUrl">{{element.url}}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="16" fill="currentColor" class="bi bi-box-arrow-right modalArrow" viewBox="0 0 16 16" @click="toggleSettingsModal(element.type,element)">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </div>
        </draggable>
        <button @click="addField('rootlink', undefined); toggleSettingsModal('rootlink', list[list.length-1])" class="Add-Button">Add Link</button>
      </div>
      <div id="SocialIcons" :class="{hidden: activeTab !== 'Social Icons'}">
        <h2 class="text">Social Media Icons:</h2>
        <draggable :list="socialsList" :disabled="!enabled" :animation="100" handle=".handle" class="list-group" ghost-class="ghost" drag-class="drag" chosen-class="chosen" fallbackClass="sortable-fallback" @start="dragging = true">
          <div class="list-group-item" v-for="element in socialsList" :key="element.id">
            <div class="handle">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </div>
            <img class="iconImg" :src="file[element.id]" alt="" :class="{hidden: file[element.id]===undefined}">
            <div class="list-group-item-description">
              <p class="linkTitle" >{{element.title}}</p>
              <p class="linkUrl">{{element.link}}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="18" fill="none" viewBox="0 0 10 18" @click="toggleSettingsModal('social',element)">
              <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"/>
            </svg>
            <div class="modal" :class="{hidden: modalHidden.social}" @click="modalClick($event, element)">
              <div class="modalContent">
                <div class="modalContainer">
                  <div class="platformSelector">
                    <p class="platformSelector">Select Your Platform:</p>
                    <Dropdown :Options="dropdownOptions"/>
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
        <button @click="addField('social', undefined)" class="Add-Button">Add Link</button>
      </div>
      <div id="color" :class="{hidden: activeTab !== 'Colors'}">
        <input type="checkbox" id="modeSelector" v-model="advancedMode">
        <label for="modeSelector">Advanced</label>
        <hr>
        <div v-if="!advancedMode">
          <color-picker-basic></color-picker-basic>
        </div>
        <div v-if="advancedMode">
          <color-picker-advanced></color-picker-advanced>
        </div>
      </div>
      <div id="Widgets" :class="{hidden: activeTab !== 'Widgets'}">
        <div id="widgetsContainer">
          <div class="availableWidgets">
            <h2>Available Widgets</h2>
            <div class="widgetList">
              <div class="container1" id="videoEmbedContainer">
                <div class="widgetContainer" >
                  <div class="title">
                    <p>Embedded Video or Stream</p>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><g clip-path="url(#clip0)"><path d="M24.2306 5.82018C24.0929 5.31144 23.8244 4.84764 23.4517 4.47496C23.079 4.10228 22.6152 3.83372 22.1065 3.69602C20.245 3.18823 12.7478 3.18823 12.7478 3.18823C12.7478 3.18823 5.25193 3.20349 3.38954 3.71177C2.88073 3.84933 2.41686 4.11784 2.04416 4.49054C1.67146 4.86324 1.40294 5.32712 1.26538 5.83593C0.701992 9.14493 0.483524 14.1874 1.28064 17.3645C1.41842 17.8732 1.68701 18.337 2.05968 18.7097C2.43234 19.0823 2.8961 19.3509 3.4048 19.4887C5.26719 19.9965 12.766 19.9965 12.766 19.9965C12.766 19.9965 20.2618 19.9965 22.1242 19.4887C22.6329 19.351 23.0967 19.0825 23.4694 18.7098C23.8421 18.3371 24.1106 17.8733 24.2483 17.3645C24.8403 14.0506 25.0233 9.0111 24.2306 5.82018Z" fill="#FF0000"></path><path d="M10.3633 15.1943L16.5817 11.5925L10.3633 7.99072V15.1943Z" fill="white"></path></g><defs><clipPath id="clip0"><rect width="24" height="24" fill="white" transform="translate(0.76001 0.0766602)"></rect></clipPath></defs></svg>
                  </div>
                </div>
                <div class="addWidgetButton" id="videoEmbedButton">
                  <div class="bar"/><div class="button" @click="addField('widget', 'videoEmbed'); toggleSettingsModal('videoEmbed', list[list.length-1])">+</div>
                </div>
              </div>
              <div class="container1" id="fileUploadContainer">
                <div class="widgetContainer">
                  <div class="title">
                    <p>File Upload</p>
                    <img width="25px" src="https://image.flaticon.com/icons/png/512/337/337946.png" alt="https://image.flaticon.com/icons/png/512/337/337946.png" class="transparent">
                  </div>
                </div>
                <div class="addWidgetButton" id="fileUploadButton">
                  <div class="bar"/><div class="button" @click="addField('widget', 'fileUpload'); toggleSettingsModal('fileUpload', list[list.length-1])">+</div>
                </div>
              </div>
            </div>
          </div>
          <div class="usedWidgets">
            <h2>Rootlinks</h2>
            <draggable :list="list" :disabled="!enabled" :animation="100" handle=".handle" class="list-group" ghost-class="ghost" drag-class="drag" chosen-class="chosen" fallbackClass="sortable-fallback" @start="dragging = true">
              <div class="list-group-item" v-for="element in list" :key="element.id">
                <VideoEmbedModal
                    :title="element.title"
                    :url="element.url" :id="element.id"
                    :shown="!modalHidden.videoEmbed"
                    @close="modalClick($event, currentSettings)"
                    @remove="removeEntry('widget')"
                    @titleInput="element.title=$event"
                    @urlInput="element.url=$event"
                ></VideoEmbedModal>
                <div class="handle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                    <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                </div>
                <img class="iconImg" :src="file[element.id]" alt="" :class="{hidden: file[element.id]===undefined}">
                <div class="list-group-item-description">
                  <p class="linkTitle" >{{element.title}}</p>
                  <p class="linkUrl">{{element.url}}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="16" fill="currentColor" class="bi bi-box-arrow-right modalArrow" viewBox="0 0 16 16" @click="toggleSettingsModal(element.type,element)">
                  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div id="Highlights" :class="{hidden: activeTab !== 'Highlights'}">
        <div id="highlightsContainer">
          <div class="highlightSettings">
            <h2>Highlights</h2>
            Pick a Rootlink <CustomButton @click="pickRootlink">Pick</CustomButton>
          </div>
          <div>
            <h2>Rootlinks</h2>
            <draggable :list="list" :disabled="!enabled" :animation="100" handle=".handle" class="list-group" ghost-class="ghost" drag-class="drag" chosen-class="chosen" fallbackClass="sortable-fallback" @start="dragging = true">
              <div class="list-group-item" v-for="element in list" :key="element.id" @click="rootlinkSelected(element)">
                <img class="iconImg" :src="file[element.id]" alt="" :class="{hidden: file[element.id]===undefined}">
                <div class="list-group-item-description">
                  <p class="linkTitle" >{{element.title}}</p>
                  <p class="linkUrl">{{element.url}}</p>
                </div>
              </div>
            </draggable>
          </div>
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
import CheckBox from "@/components/Utilities/CheckBox";
import TextInput from "@/components/Utilities/TextInput";
import CustomButton from "@/components/Utilities/CustomButton";
import Dropdown from "@/components/Utilities/Dropdown";
import HorizontalChooser from "./Utilities/HorizontalChooser";
import ColorPickerBasic from "./ColorPickerBasic";
import ColorPickerAdvanced from "./ColorPickerAdvanced";
import RootlinksModal from "@/components/EditorModals/RootlinksModal";
import VideoEmbedModal from "@/components/EditorModals/VideoEmbedModal";


export default {
  name: "PageBuilder",
  components: {RootlinksModal, ColorPickerAdvanced, ColorPickerBasic, HorizontalChooser, Dropdown, CustomButton, TextInput, CheckBox, Sidebar, draggable, VueGpickr, VideoEmbedModal},
  data(){
    return{
      dropdownOptions:[{title: 'YouTube', img:'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png'},
        {title: 'Facebook', img:'https://cdn.icon-icons.com/icons2/2108/PNG/512/facebook_icon_130940.png'},
        {title: 'Instagram', img:'https://icoff.ee/fa/wp-content/uploads/2019/06/instagram-logo.png'}],
      modalHidden: {
        rootlink: true,
        social: true,
        videoEmbed: true,
      },
      advancedMode: false,
      activeTab: 'Rootlinks',
      file: {},
      currentSettings: {},
      enabled: true,
      dragging: true,
      selectionActive: false,
      selectedRootlink: null
    }
  },
  methods:{
    submit() {
      this.$store.dispatch("savePage", this.$store.state)
    },
    log(evt){
      console.log(evt)
    },
    modalClick(evt, linkItem){
      if(evt.target.classList.contains('closeItem')){
        this.toggleSettingsModal(undefined, linkItem)
      }

    },
    toggleSettingsModal(linkType, linkItem){
      this.currentSettings = linkItem
      if(linkType === undefined)
      {
        let instance = this
        Object.keys(this.modalHidden).forEach(function(k){
          instance.modalHidden[k] = true;
        });
        return
      }
      if(linkType === 'widget'){
        this.modalHidden[linkItem.widgetParameter.type] = !this.modalHidden[linkItem.widgetParameter.type]
        return
      }
      this.modalHidden[linkType] = !this.modalHidden[linkType]
    },
    tabChange(item){
      console.log(item.title)
      this.activeTab = item.title
    },
    submitPage() {
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
              id: this.currentSettings.id,
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
    removeEntry(type) {
      let id = this.currentSettings.id
      this.$store.commit("removeEntry", {id,type})
    },
    addField(type, widgetType) {
      this.$store.commit("emptyEntry", {type: type, widgetType: widgetType})
    },
    pickRootlink(){
      this.selectionActive = true;
    },
    rootlinkSelected(element){
      if(this.selectionActive){
        for(let i in this.list){
          if(this.list[i] !== element){
            this.list[i].highlighting.active = false;
          }else{
            this.list[i].highlighting.active = !this.list[i].highlighting.active;
          }
        }
      }
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

<style scoped lang="scss">


div#highlightsContainer{
  display:flex;
  flex-direction: row;
  justify-content: space-around;
}



div.highlightSettings{
  margin-top:15px;
  width: 700px;
  height: 90vh;
  color: var(--text-color);
  border-radius: 10px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  border: var(--editor-items-border);

}

#Rootlinks{
  overflow-y: auto;
  max-height: calc(100vh - 53px)

}

#Preview {
  @media screen and (max-width: 1100px) {
    display:none;
  };
}

.title{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left:0;
  justify-content: space-between;
  z-index: -10;
}

.widgetContainer{
  border: 1px solid black;
  margin: 10px auto;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  border: var(--editor-items-border);
  height: 50px;
  z-index: 5;
  background-color: white;
  width: 264px;
}

#widgetsContainer{
  justify-content: space-around;
  align-items: stretch;
  display: flex;
  flex-direction: row;
}

.widgetList{
  margin-left: -15px;
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 314px;
  align-items: flex-start;
}
.container1{
  margin-top: 20px;
  position: relative;
  display: flex;
  flex-direction: row;
}


#fileUploadContainer:hover > #fileUploadButton{
  margin-left: 0;
}

#videoEmbedContainer:hover > #videoEmbedButton{
  margin-left: 0;
}

.addWidgetButton{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left:-51px;
  transition: margin-left 0.2s;
}



.addWidgetButton .bar{
  width: 15px;
  height: 5px;
  background-color: lightblue;
}

.addWidgetButton .button{
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: lightblue;
  line-height: 36px;
  font-family: Montserrat, sans-serif;
  font-size: 2.2em;
  color: #3d6876;
}

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


.widgetContainer p{
  font-family: 'Montserrat', sans-serif;
  font-weight: 550;
  margin-right: 10px;
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
  z-index: 10;
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
.linkUrl{
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



#pageBuilder{
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  border-radius: 0;
  padding: 0;
  margin: auto;

  @media screen and (max-width: 1100px) {
    justify-content: left;
  }
}

#editArea{
  min-height: 100vh;
  height: 100vh;
  width: 100000px;
  background-color: var(--background-color);

  @media screen and (max-width: 1100px) {
    margin: 0 auto;
  }
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

/*
.container {
  width: calc(100vw - 410px);
  height: calc(100vh - 120px);
  color: var(--text-color);
  background-color: var(--surface-color);
}*/

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
