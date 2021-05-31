<template>
  <div class="modalContent" :class="{hidden: !shown}">
    <div class="verticalContainer">
      <div class="horizontalContainer">
        <div class="titleUrlSettings">
          <h2>Content</h2>
          <div>
            <label>Title</label>
            <TextInput title="Title" :value="title" placeholder="My Awesome Link" @input="$emit('titleInput', $event)"/>
          </div>
          <div>
            <TextInput title="Url" :value="url" placeholder="https://www.example.com" v-model="url" @input="$emit('urlInput', $event)"/>
          </div>
          <div>
            <CheckBox text="Embed Video" class="CheckBox"/>
          </div>
        </div>
        <div class="iconSettings">
          <h2>Icon</h2>
          <CustomButton type="button" @click="getFavicon(url, id)">Get Website Icon</CustomButton>
          <CustomButton type="fileSelector" :bindId="id" @fileSelected="$emit('newIcon', $event)">Upload Own Icon</CustomButton>
        </div>
        <span class="close closeItem" @click=" $emit('close', $event)">&times;</span>

      </div>
      <div class="horizontalContainer last">
        <CustomButton type="button" classProp="closeItem" @click="$emit('remove', $event); $emit('close', $event)">Delete Link</CustomButton>
        <CustomButton type="button" classProp="closeItem" @click="$emit('close', $event)">Save</CustomButton>

      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Utilities/CustomButton";
import CheckBox from "@/components/Utilities/CheckBox";
import TextInput from "@/components/Utilities/TextInput";

export default {
  name: "RootlinksModal",
  props:["title", "url", "id", "shown"],
  components: {CustomButton, CheckBox, TextInput},
  methods: {
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
          this.$store.commit("addImageToEntry", {imgData, type: 'rootlink'});
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
        this.$emit('newIcon', this.file[id])
      })
    },

  }

}
</script>

<style scoped lang="scss">

.modalContent {

  display: flex;
  position: fixed;
  z-index: 10;
  left: 500px;
  top:50px;
  color: var(--text-color);
  background-color: var(--background-color);
  margin: 5% auto 5% auto;
  padding: 10px;
  border-radius: 10px;
  width: 800px;
  height: 400px;
  flex-direction: row;
  justify-content: stretch;
}

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

label{
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2em;
  font-weight: 500;
}

.hidden{
  display: none;
}

.no-scroll{
  overflow-y: hidden !important;
}

</style>
