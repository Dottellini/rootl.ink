<template>
  <div class="container">
    <LoginField class="login"></LoginField>
    <p>{{$t('NoAccount')}} <router-link to="/register">{{$t('register')}}!</router-link></p>
  </div>
</template>

<script>
import LoginField from "../components/LoginField";
export default {
  name: "login.vue",
  components: {
    LoginField,
  },

  beforeCreate() {
    if(this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  }

}
</script>

<style scoped lang="scss">
  .login {
    max-width: 500px;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  p {
    font-family: 'Montserrat', sans-serif;
    color: var(--text-color);
    a {
      font-family: 'Montserrat', sans-serif;
      color: var(--text-color);
    }
  }
</style>