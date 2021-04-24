<template>
  <div class="dropdown">
    <button class="btn">{{$t('language')}} ▼</button>
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
  name: "languageDrop",
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
      localStorage.setItem("language", locale)
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  background-color: transparent;
  border-radius: 10px 10px 0 0;
  border: none;
  color: #05b8a6;
  padding: 8px;
  min-width: 8em;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  min-width: 4em;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  left: 0;
  right: 0;
  display: none;
  position: absolute;
  background-color: var(--surface-color);
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  z-index: 1;
  @media screen and (max-width: 768px) {
    position: relative;
  }
}

/* Links inside the dropdown */
.dropdown-content button {
  color: var(--text-color);
  background-color: var(--surface-color);
  cursor: pointer;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
  border: none;
  padding: 10px 0;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content button:hover {
  border: none;
  background-color: var(--hover-color);
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
}



</style>