<template>
  <div>
    <h1>Email confirmed!</h1>
    <router-link to="/login">Login here!</router-link>
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

</style>