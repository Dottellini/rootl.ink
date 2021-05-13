<template>
  <div>
    Email<input v-model="email"><button @click="getCode">Send</button><br>
    Username<input v-model="username"><br>

    <h1>Check your mailbox to reset your password</h1><br>
    ResetCode<input v-model="resetCode"><br>
    NewPassword<input v-model="newPassword"><br>
    Username<input v-model="username"><br>
    <button @click="submit">Submit</button>
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
      email: undefined
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
        body:JSON.stringify({
          "email": this.email,
          "username": this.username
        })
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