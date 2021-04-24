<template>
  <div>
    <h1>{{$t('emailConfirmation.confirmed')}}</h1>
    <router-link class="router" to="/login">{{$t('emailConfirmation.loginHere')}}</router-link>
  </div>
</template>

<script>
export default {
  name: "EmailConfirmation",

  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const email = urlParams.get('email');
    fetch('/confirmEmail', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code: code, email:email}),
    })
        .then(data => {
          console.log('Success:', data);

        })
        .catch((error) => {
          console.error('Error:', error);
        });
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