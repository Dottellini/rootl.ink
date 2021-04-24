<template>
  <div class="container">
    <RegisterField class="register"></RegisterField>
    <p>{{$t('alreadyAccount')}} <router-link to="/login">{{$t('login')}}!</router-link></p>
  </div>
</template>

<script>
import RegisterField from "../components/RegisterField";
export default {
  name: "register",
  components: {
    RegisterField
  },

  beforeCreate() {
    if(this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  }
}
</script>

<style scoped lang="scss">
  .register {
    max-width: 500px;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  p {
    color: var(--text-color);
    a {
      color: var(--text-color);
    }
  }
</style>