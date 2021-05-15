<template>
  <div id="Sidebar" :style="SidebarStyle">
    <div  v-for="link in links.split(',')" class="SidebarItem" :class="{highlighted:highlighted=== link}" @click="$emit('click',link); toggleHighlighting(link)">
      {{link}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props:["width","height", "links", "highlightedAtLoad"],
  data(){
    return{
      highlighted: this.$props.highlightedAtLoad
    }
  },
  computed: {
    SidebarStyle(){
      return `width:${this.width};`
    }
  },
  methods:{
    toggleHighlighting(value){
      this.highlighted=value
    }
  }
}
</script>

<style scoped lang="scss">
  #Sidebar{
    border: 1px solid #AAA;
    border-radius: 10px;
    max-width: 225px;
  }

  .highlighted{
    font-weight: 700;
  }

  #FirstSidebarItem{
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .SidebarItem{
    height: 50px;
    border: 1px solid #AAA;
    line-height: 50px;
    text-align: center;


    font-family: "Montserrat", sans-serif;
    margin: 0 auto;
  }
  .SidebarItem:hover{
    background-color: #EEE;
  }
</style>