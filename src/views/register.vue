<template>
  <div>
    <RegisterField></RegisterField>
    <p>already have an account? <router-link to="/login">Log in!</router-link></p>
  </div>
</template>

<script>
import RegisterField from "../components/RegisterField";
export default {
  name: "register",
  components: {
    RegisterField
  }
}
</script>

<style scoped lang="scss">
  p {
    color: var(--text-color);
    a {
      color: var(--text-color);
    }
  }
</style>