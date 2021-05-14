<template>
  <div>
    <div class="container" id="container1">
      <form class="form">
        Email or Username <input v-model="emailOrUsername" placeholder="E-Mail or Username"><br>
        <button @click="getCode" type="button">Send Reset Code</button>
      </form>
    </div>

    <div class="container" id="container2" :class="{active: active}">
      <form class="form">
        ResetCode<input v-model="resetCode"><br><br>
        NewPassword<input v-model="newPassword"><br>
        <button @click="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  data(){
    return {
      active: false,
      resetCode: undefined,
      newPassword: undefined,
      emailOrUsername: undefined
    }
  },
  methods: {
    submit: function (){
      fetch('/resetPassword',{
        method:'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          resetCode: this.resetCode,
          newPassword: this.newPassword,
          username: this.username
        })
      }).then(res=>{
        console.log(res)
      })
    },
    getCode: function (){
      this.active = true;
      fetch('/requestPasswordReset',{
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          username: this.username
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
h1 {
  font-family: 'Montserrat', sans-serif;
  color: var(--text-color);
}

.container{
  justify-content: space-around;
  align-items: center;
  max-width: 500px;
  margin: 10px auto;
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
}

#container1{
  height: 125px;
}

#container2{
  height: 200px;
  opacity:0.2;
  pointer-events: none;
}

#container2.container.active{
  height: 200px;
  opacity:1;
  pointer-events: auto;
}

.form {
  display: flex;
  flex-direction: column;

button {
  cursor: pointer;
  text-decoration: none;
  outline: none;
  border: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5em;
  color: var(--background-color);
  background-color: var(--text-color);
  border-radius: 50px;
  padding: 0.3em 1.5em;

&:hover {
   color: var(--text-color);
   background-color: var(--background-color);
   border: 1px solid var(--text-color);
 }
}

input {
  outline: none;
  color: var(--text-color);
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5em;
  margin: 0.5em 0;
  padding: 0.1em 1em;
  border-radius: 50px;
  background-color: var(--background-color);
  border: 1px solid var(--text-color);
}
}

</style>