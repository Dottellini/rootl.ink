<template>
  <div class="textInput">
    <label>{{text}}</label>
    <input id="textInput" type="text" :placeholder="placeholder" :value="value" @input="$emit('input', $event.target.value)" />
  </div>

</template>

<script>
export default {
  name: "TextInput",
  data(){
    return{
    }
  },
  props:['placeholder', 'text'],
}
</script>

<style scoped>

  input{
    outline: none;
    color: var(--text-color);
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2em;
    margin: 0.5em 0 0.5em 5px;
    padding: 0.1em 1em;
    border-radius: 50px;
    background-color: var(--background-color);
    border: 1px solid var(--text-color);
  }

  label{
    font-weight: 500;
    font-family: Montserrat, sans-serif
  }

</style>