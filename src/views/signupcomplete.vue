<template>
  <div class="container">
    <h1>Sign up complete</h1>
    <h2>Check your E-Mail to confirm your registration</h2>

    <router-link class="redirect-home" to="/">Go back Home</router-link>
  </div>
</template>

<script>
export default {
  name: "SignUpComplete"
}
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .redirect-home {
    font-family: 'Montserrat', sans-serif;
    color: var(--text-color)
  }

  h1, h2 {
    font-family: 'Montserrat', sans-serif;
    color: var(--text-color)
  }
</style>