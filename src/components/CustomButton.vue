<template>
  <div class="customButton">
    <button v-if="type!=='fileSelector'" @click="$emit('click')">
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
  props:["text", "type", "bindId", "width"],
  methods:{
    openFileSelector(evt){
      if(evt.target.outerHTML.includes('class="fileSelector"')){
        this.counter++;
        console.log(this.counter)
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
button, .fileSelector{
  background-color: var(--background-color);
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