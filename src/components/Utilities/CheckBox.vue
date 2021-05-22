<template>
  <div class="checkbox-component">
    <label>{{text}}
      <input type="checkbox" checked="checked">
      <span class="checkmark"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: "CheckBox",
  props:{text:{required:true}},
  data(){
    return{

    }
  }
}

</script>

<style scoped>
.checkbox-component{
  width:160px;
  overflow: hidden;
}

.checkbox-component label{
  user-select: none;
  display: block;
  position: relative;
  padding-right: 35px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 18px;
}

.checkbox-component label input {
  height: 0;
  width: 0;
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

.checkmark {
  height: 20px;
  width: 20px;
  position: absolute;
  right: 0;
  top: 0;
  background-color: lightgray;
  border-radius: 3px;
}

.checkbox-component label:hover input ~ .checkmark {
  background-color: lightgray;
}

.checkbox-component label input:checked ~ .checkmark {
  background-color: green;
}

.checkmark:after {
  content: "";
  display: none;
  position: absolute;
}

.checkbox-component label input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-component label .checkmark:after {
  transform: rotate(45deg);
  left: 7px;
  top: 3px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 3px 3px 0;
}
</style>