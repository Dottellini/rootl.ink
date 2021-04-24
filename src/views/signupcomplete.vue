<template>
  <div class="container">
    <h1>{{$t('signupComplete.headline')}}</h1>
    <h2>{{$t('signupComplete.text')}}</h2>

    <router-link class="redirect-home" to="/">{{$t('goHome')}}</router-link>
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