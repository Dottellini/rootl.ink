<template>
  <div class="dropdown">
    <button class="dropbtn">Language</button>
    <div class="dropdown-content">
      <button v-for="entry in languages" :key="entry.title" @click="changeLocale(entry.language)">
        {{entry.title}}
      </button>
    </div>
  </div>
</template>

<script>
import i18n from '../i18n.js';
export default {
  name: "LanguageDrop",
  data() {
    return {
      languages: [
        {flag: 'us', language: 'en', title: "English"},
        {flag: 'de', language: 'de', title: "Deutsch"}
      ]
    }
  },
  methods: {
    changeLocale: function(locale) {
      i18n.locale = locale;
    }
  }
}
</script>

<style scoped lang="scss">
.dropbtn {
  background-color: transparent;
  border-radius: 10px 10px 0 0;
  border: 1px solid #05b8a6;
  color: #05b8a6;
  padding: 8px;
  margin: 0 0 0 1em;
  min-width: 8em;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  min-width: 8em;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  left: 0;
  right: 0;
  display: none;
  position: absolute;
  margin: 0 0 0 1em;
  background-color: var(--surface-color);
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  z-index: 1;
  @media screen and (max-width: 768px) {
    position: relative;
  }
}

/* Links inside the dropdown */
.dropdown-content a {
  color: var(--text-color);
  font-family: 'Montserrat', sans-serif;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: var(--hover-color);
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  background-color: #05b8a6;
  border: 1px solid #05b8a6;
  color: white;
}

</style>