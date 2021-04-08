<template>
  <div class="container">
    <LoginField class="login"></LoginField>
    <p>don't have an account? <router-link to="/register">Register!</router-link></p>
  </div>
</template>

<script>
import LoginField from "../components/LoginField";
export default {
  name: "login.vue",
  components: {
    LoginField,
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
    color: var(--text-color);
    a {
      color: var(--text-color);
    }
  }
</style>