<template>
  <div class="dropdown">
    <div class="dropdownButton" @click="toggleDropdown">
      <div class="contentContainer">
        <p>{{selectedOption.title}}</p>
        <img :src="selectedOption.img">
      </div>
      <svg class="svgArrow" xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18" :class="{rotated: optionsHidden}">
        <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 1l8 8-8 8"></path>
      </svg>
    </div>
    <div class="options" :class="{hidden: optionsHidden}">
      <div class="option" v-for="option in options" @click="optionSelected(option)">
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
</template>

<script>
export default {
  name: "Dropdown",
  props: ['Options'],
  data(){
    return{
      selectedOption: {title: 'YouTube', img:'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png'},
      optionsHidden: true,
      options: [
        {title: 'YouTube', img:'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png'},
        {title: 'Facebook', img:'https://cdn.icon-icons.com/icons2/2108/PNG/512/facebook_icon_130940.png'},
        {title: 'Instagram', img:'https://icoff.ee/fa/wp-content/uploads/2019/06/instagram-logo.png'}
      ]
    }
  },
  mounted() {
    this.options = JSON.parse(this.Options)
  },
  methods:{
    toggleDropdown() {
      this.optionsHidden = !this.optionsHidden
    },
    optionSelected(option){
      this.selectedOption = option;
      this.toggleDropdown()
    }
  }
}
</script>

<style scoped>

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

.options{
  width: 170px;


}

.hidden{
  display: none;
}


</style>