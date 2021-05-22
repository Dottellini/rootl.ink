<template>
  <div class="wrapper">
    <label class="checkbox">{{text}}
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
.wrapper{
  width:160px;
  overflow: hidden;

}

.checkbox{
  display: flex;
  flex-direction: row;
    justify-content: space-between;
}

.wrapper label{
  user-select: none;
  display: block;
  position: relative;
  padding-right: 35px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 18px;
}

.wrapper label input {
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

.wrapper label:hover input ~ .checkmark {
  background-color: lightgray;
}

.wrapper label input:checked ~ .checkmark {
  background-color: green;
}

.checkmark:after {
  content: "";
  display: none;
  position: absolute;
}

.wrapper label input:checked ~ .checkmark:after {
  display: block;
}

.wrapper label .checkmark:after {
  transform: rotate(45deg);
  left: 7px;
  top: 3px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 3px 3px 0;
}
</style>