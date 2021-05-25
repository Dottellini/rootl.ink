<template>
  <div class="wrapper">
    <p>{{text}}</p>
    <div class="dropdown">
      <div class="dropdownButton" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
        <div class="contentContainer">
          <p v-if="selectedOption!==undefined">{{selectedOption.title}}</p>
          <img  v-if="selectedOption!==undefined" :src="selectedOption.img">
        </div>
        <svg class="svgArrow" xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18" :class="{rotated: optionsHidden}">
          <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"></path>
        </svg>
      </div>
      <div class="options" :class="{hidden: optionsHidden}" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
        <div class="option" v-for="option in options" @click="optionSelected(option)" :class="{first: option === options[0]}">
          <div class="contentContainer">
            <p>{{option.title}}</p>
            <img :src="option.img">
          </div>
          <svg class="svgArrow" xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18" :class="{rotated: optionsHidden}">
            <path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"></path>
          </svg>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Dropdown",
  props: ['Options', 'text'],
  data(){
    return{
      selectedOption: {title: "Select One", img: ""},
      optionsHidden: true
    }
  },
  computed:{
    options(){
      return this.Options
    }
  },
  methods:{
    toggleDropdown() {
      this.optionsHidden = !this.optionsHidden
    },
    optionSelected(option){
      this.selectedOption = option;
      //this.toggleDropdown()
    }
  }
}
</script>

<style scoped>

.wrapper{
  display: flex;
  flex-direction: row;
  justify-content: center;
}


.contentContainer{
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 130px;
}

p{
  margin:0;
  height: 35px;
  line-height: 35px;
}

img{
  margin:0;
  width: auto;
  height: 25px;
}

.svgArrow{
  transform: rotate(90deg);
  margin-right: 10px;
}

.svgArrow.rotated{
  transform: rotate(0deg);
}

.dropdown{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdownButton{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 35px;
  border: 1px solid black;
  line-height: 35px;
  width: 170px;
  z-index: 1;
}

.option{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 35px;
  border: 1px solid black;
  line-height: 35px;
  width: 170px;
  border-top-width: 0;
}

.option.first{
  margin-top:36px
}

.options{
  background-color: white;
  position: fixed;
  width: 172px;


}

.hidden{
  display: none;
}


</style>