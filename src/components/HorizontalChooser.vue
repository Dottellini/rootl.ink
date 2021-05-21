<template>
  <!--<div class="horizontalChooser">
    <div class="horizontalChooserItem first" :class="{active:activeTypeSelectorItem.Links === 0}" @click="activeTypeSelectorItem.Links=0">
      Single Color
    </div>
    <div class="vl"/>
    <div class="horizontalChooserItem" :class="{active:activeTypeSelectorItem.Links === 1}" @click="activeTypeSelectorItem.Links=1">
      Gradient
    </div>
    <div class="vl"/>
    <div class="horizontalChooserItem last" :class="{active:activeTypeSelectorItem.Links === 2}" @click="activeTypeSelectorItem.Links=2">
      Picture
    </div>
  </div>-->





  <div class="horizontalChooser" :style="horizontalChooserStyle">
    <div v-for="option in options" class="horizontalChooserOption" :class="{active: activeOption=== option, last: option === options[options.length-1], first: option === options[0]}" @click="setActiveOption(option); $emit('optionSelection',option)">
      {{option}}
    </div>
  </div>
</template>

<script>
export default {
  name: "horizontalChooser",
  props:['options'],
  data(){
    return {
      activeOption: undefined,
      options:["Option1", "Option2", "Option3"]
    }
  },
  mounted() {
    this.activeOption = this.options[0]
  },
  methods:{
    setActiveOption(option){
      this.activeOption = option;
    }
  },
  computed:{
    horizontalChooserStyle(){
      return `width: ${this.options.length*111}px`
    }
  }
}
</script>

<style scoped>

.horizontalChooser{
  margin: 100px;
  border: 1px solid black;
  border-radius: 20px;
  width: 333px;
  height: 30px;
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
}


.horizontalChooserOption{
  width: 111px;
}

.horizontalChooserOption:hover, .horizontalChooserOption.active{
  background-color: lightblue;
}

.horizontalChooserOption:not(.last){
  border-right: 1px solid black;
}

.horizontalChooserOption.first{
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.horizontalChooserOption.last{
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}


</style>