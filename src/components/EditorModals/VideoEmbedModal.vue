<template>
  <div class="modalContent" :class="{hidden: !shown}">
    <div class="verticalContainer">
    <h2>Content</h2>
      <Dropdown  :Options='dropdownOptions' text='Platform' class="Settings" />
      <TextInput title="Title" placeholder="Title" class="Settings" @input="$emit('titleChange', $event)"/>
      <TextInput title="Url" placeholder="Url" class="Settings" @input="$emit('urlChange', $event)"/>
      <div class="footer">
        <hr>
        <CustomButton classProp="closeItem" @click="$emit('close', $event)"> Delete Widget</CustomButton>
      </div>
    </div>
    <div class="vl"/>
    <div class="verticalContainer">

      <h2>Settings</h2>
      <CheckBox text="Autoplay" class="Settings"/>
      <CheckBox text="Loop Video" class="Settings"/>

      <div class="footer">
        <hr>
        <CustomButton classProp="closeItem" @click="$emit('close', $event)"> Save</CustomButton>
      </div>
    </div>
    <span class="close closeItem" @click="$emit('close', $event)">&times;</span>

  </div>
</template>

<script>
import TextInput from "@/components/Utilities/TextInput";
import Dropdown from "@/components/Utilities/Dropdown";
import CustomButton from "@/components/Utilities/CustomButton";
import CheckBox from "@/components/Utilities/CheckBox";

export default {
  name: "VideoEmbedModal",
  components: {CheckBox, Dropdown, TextInput, CustomButton},
  data(){
    return{
      dropdownOptions: [{title: "YouTube", img:"https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"},
        {title: "Twitch", img:"https://cdn.icon-icons.com/icons2/2108/PNG/512/facebook_icon_130940.png"},
        {title: "Vimeo", img:"https://icoff.ee/fa/wp-content/uploads/2019/06/instagram-logo.png"}]
    }
  },
  props:["shown", "title", "url"]
}
</script>

<style scoped lang="scss">


hr{
  border-top: 1px solid black;
  border-bottom: 0;
}

.vl{
  width: 0;
  height: 100%;
  border-left: 1px solid black;
}

.finishButton{
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 100000px;
}


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

.Settings{
  margin: 0 auto 0 10px;
}


.verticalContainer{
  width: 100%;
  display: flex;
  justify-content:flex-start;
  flex-direction: column;
  align-items: stretch;
}

.footer{
  margin-top:auto;
}


.hidden{
  display: none;
}
</style>
