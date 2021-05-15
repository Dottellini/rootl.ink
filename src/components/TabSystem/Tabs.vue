<template>
  <div id="Tabs">
    <ul class='tabs__header'>
      <li v-for='(tab, index) in tabs'
          :key='tab.title'
          @click='selectTab(index)'
          :class='{"tab__selected": (index === selectedIndex)}'>
        {{ tab.title }}
      </li>
    </ul>
    <slot id="slot"></slot>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  data () {
    return {
      selectedIndex: 0, // the index of the selected tab
      tabs: [],
    }
  },

  created() {
    this.tabs = this.$children
  },

  mounted () {
    this.selectTab(0)
  },

  methods: {
    selectTab (i) {
      this.selectedIndex = i

      // loop over all the tabs
      this.tabs.forEach((tab, index) => {
        tab.isActive = (index === i)
      })
    }
  },

}
</script>

<style scoped lang="scss">
  #Tabs{
    display: flex;
    flex-direction: column;
  }

  ul.tabs__header {
    font-family: 'Montserrat', sans-serif;
    color: var(--text-color);
    display: block;
    list-style: none;
    margin: 0 0 0 1em;
    padding: 0;
  }
  ul.tabs__header > li {
    padding: 1em 2em;
    border-radius: 10px;
    margin: 0 0.3em 0 0;
    display: inline-block;
    cursor: pointer;
  }
  ul.tabs__header > li.tab__selected {
    font-weight: bold;
    border-radius: 10px 10px 0 0;
    border-bottom: 2px solid var(--text-color);
  }
  .tab {
    display: inline-block;
    color: var(--text-color);
    padding: 20px;
    min-width: 800px;
    border-radius: 10px;
    min-height: 400px;
  }
</style>