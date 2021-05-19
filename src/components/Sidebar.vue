<template>
  <div id="SidebarWrapper">
  <div id="iconBar">
    <div class="iconItem" v-for="(sidebarItem,index1) in sidebarItems" @click="iconBarChange(index1)" :class="{active: activeIconTab===index1}">
      {{sidebarItem.iconBarItem}}
    </div>
  </div>
    <div id="textBar" :class="{hidden: textBarHidden}">
      <div class="textBarItem" v-for="(textBarItem, index2) in sidebarItems[iconBarIndex].textBarItems" :class="{lastItem: index2===sidebarItems[iconBarIndex].textBarItems.length-1, hoverActive: dropdownHidden[textBarItem.textBarItem]}">
        <div class="dropdownItems" v-if="typeof textBarItem === 'object'">
          <div class="dropdownTitle" @click="toggleDropdown(textBarItem.textBarItem)">
            <svg class="ddSvg" :class="{rotated: !dropdownHidden[textBarItem.textBarItem]}">
              <path d="m 0 0 l 0 12 l 8 -6 z" fill="white" stroke="white"/>
            </svg>
            <div class="dropdownTitleText">{{textBarItem.textBarItem}}</div>
          </div>
          <div class="dropdownItemWrapper">
            <div class="dropdownItem" v-for="(dropdownItem, index3) in textBarItem.dropdownItems" :class="{hidden: dropdownHidden[textBarItem.textBarItem], active: activeTab===dropdownItem}" @click="tabChange(dropdownItem);$emit('itemClick',{index: index3,title:dropdownItem})">
              {{dropdownItem}}
            </div>
          </div>
        </div>
        <div class="textBarItemTitle" v-if="typeof textBarItem !== 'object'" :class="{active: activeTab===textBarItem}" @click="tabChange(textBarItem); $emit('itemClick',{index: index2,title:textBarItem})">
          {{textBarItem}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: [],
  data() {
    return {
      sidebarItems: undefined,
      iconBarIndex: 0,
      dropdownHidden:[],
      activeIconTab:0,
      activeTab:0,
      activeDropDownTab:0,
      textBarHidden: false
    }
  },
  mounted() {
    //Add default items
    if(this.sidebarItems===undefined){
      this.sidebarItems= [
        {
          iconBarItem:"Content",
          textBarItems: ["Rootlinks","Social Icons","Widgets"]
        },
        {
          iconBarItem:"Style",
          textBarItems: [
        {
          textBarItem:"Colors",
          dropdownItems:["Background","Links","iwas anderes"]
        },
        {
          textBarItem:"Highlighting",
          dropdownItems:["Setting1","Setting2","Setting3"]
        },
        "Style 3"]}
      ]

      this.dropdownHidden={
        "Colors":false,
        "Highlighting":false
      }
    }
  },
  methods:{
    toggleDropdown(index){
      this.dropdownHidden[index] = !this.dropdownHidden[index];
    },
    tabChange(item){
      this.activeTab = item;
    },
    iconBarChange(clickedIndex){
      if(this.activeIconTab===clickedIndex || this.iconBarIndex === clickedIndex){
        this.textBarHidden = !this.textBarHidden;
        return;
      }
      this.activeIconTab = clickedIndex;
      this.iconBarIndex = clickedIndex;
      this.textBarHidden = false;
    }
  }
}
</script>

<style scoped lang="scss">
#SidebarWrapper{
  display: flex;
  flex-direction: row;
  width: 300px;
  background-color: #30324A;
  color: #89C8D9;
  border: 1px solid black;
  margin-right: 0;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
}

#textBar{
  width: 99999px;
}

#iconBar{
  min-width: 100px;
  flex: 0 0 100px;
  background-color: #1D1E2C;
  color: #42858C;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
}

.textBarItem {
  border-bottom: 1px solid black;
  line-height: 35px;
}

.textBarItem.hoverActive:hover{
  background-color: #383B56
}

.textBarItemTitle:hover{
  background-color: #383B56
}
.textBarItemTitle.active{
  background-color: #383B56
}

.iconItem{
  border-bottom: 1px solid black;
  height: 35px;
  line-height: 35px;
}
.iconItem:hover{
  background-color: #282A3E;
 }

.iconItem.active{
  background-color: #282A3E;
}

.rotated{
  transform: rotate(90deg);
}

.ddSvg{
  height: 12px;
  width: 8px;
  margin: auto 35px auto 10px;
  justify-content: center;

}

.dropdownItem:hover{
  background-color: #383B56;
}
.dropdownItem.active{
  background-color: #383B56;
}

.hidden{
  display: none;
  //height: 0;
  background-color: green;
}

.dropdownTitle{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.dropdownTitleText{
  flex-grow: 0;
  width: 0px;
}
</style>