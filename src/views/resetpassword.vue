<template>
  <div>
    <div id="step1" v-if="step === 0">
      <input v-model="email" placeholder="E-Mail"><br>
      <button @click="getCode">Send</button>
    </div>

    <div id="step2" v-if="step === 1">
      <h1>Check your mailbox to receive the Reset Code</h1><br>
      <input v-model="username" placeholder="Username"><br>
      <input v-model="resetCode" placeholder="ResetCode"><br>
      <input v-model="newPassword" placeholder="New Password"><br>
      <button @click="submit">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  data(){
    return {
      resetCode: undefined,
      newPassword: undefined,
      username: undefined,
      email: undefined,
      step: 0,
    }
  },
  methods: {
    submit: function (){
      fetch('/resetPassword',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          "resetCode": this.resetCode,
          "newPassword": this.newPassword,
          "username": this.username
        })
      })
    },
    getCode: function (){
      fetch('/requestPasswordReset',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "email": this.email,
          "username": this.username
        })
      }).then( () => {
        this.step = 1;
      })
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: 'Montserrat', sans-serif;
  color: var(--text-color);
}
.router {
  font-family: 'Montserrat', sans-serif;
  color: var(--text-color)
}


</style>