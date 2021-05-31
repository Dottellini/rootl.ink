<template>
  <div class="customButton">
    <button v-if="type!=='fileSelector'" :class="[classProp]" @click="$emit('click', $event)">
      <slot id="text">
        {{text}}
      </slot>
    </button>
    <div v-if="type==='fileSelector'" class="fileSelector" @click="openFileSelector">
      <label :for="bindId" id="fileSelectorLabel">
        <slot >{{text}}</slot>
      </label>
      <input type="file" :id="bindId" accept="image/*" @change="$emit('fileSelected',{id:bindId, outputMimeType: 'image/jpeg', evt: $event})" hidden>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      counter: 0
    }
  },
  name: "CustomButton",
  props:["text", "type", "bindId", "width", "classProp"],
  methods:{
    openFileSelector(evt){
      if(evt.target.outerHTML.includes('class="fileSelector"')){
        this.counter++;
        document.getElementById('fileSelectorLabel').click();
      }
    }
  }
}
</script>

<style scoped>

.customButton{
  display: flex;
  justify-content: space-around;
}

button {
  color: var(--text-color);
  font-family: 'Montserrat', sans-serif;
}

button, .fileSelector{
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: 'Montserrat', sans-serif;
  border: 1px solid var(--text-color);
  border-radius: 50px;
  padding: 6px 12px 6px 12px;
  font-size: 1em;
  margin: 2px;
}

.fileSelector{
  width: 150px;
}

button:hover, .fileSelector:hover{
  background-color: #ccc;
}
</style>