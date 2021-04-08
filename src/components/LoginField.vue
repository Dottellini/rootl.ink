<template>
  <div class="container">
    <h1>Login</h1>
    <form class="form">
      <input type="email" v-model="email" placeholder="E-Mail" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit" @click="submit">Log in</button>
    </form>
    <p class="error">{{error}}</p>
  </div>
</template>

<script>
export default {
  name: "LoginField",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    }
  },

  methods: {
    submit: function () {
      this.error = "";
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          email: this.email,
          password: this.password
        }),
        mode: "cors"
      })
          .then(result => {
            let reader = result.body.getReader();
            reader.read().then(function processText({ done, value }) {
              if (done) return
              let string = new TextDecoder().decode(value);
              console.log(string);
              localStorage.setItem('accessToken', JSON.parse(string).accessToken);
              console.log(localStorage.getItem('accessToken'));
              return reader.read().then(processText);
            });
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
  },

  computed: {
    username: function () {
      return this.$store.state.username
    }
  }

}
</script>

<style scoped lang="scss">
  h1{
    color: var(--text-color)
  }

  .error {
    color: red;
  }

  .form {
    display: flex;
    flex-direction: column;

    button {
      cursor: pointer;
      text-decoration: none;
      outline: none;
      border: none;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.5em;
      color: var(--background-color);
      background-color: var(--text-color);
      border-radius: 50px;
      padding: 0.3em 1.5em;

      &:hover {
         color: var(--text-color);
         background-color: var(--background-color);
         border: 1px solid var(--text-color);
       }
    }

    input {
      outline: none;
      color: var(--text-color);
      font-weight: 500;
      font-family: 'Montserrat', sans-serif;
      font-size: 1.5em;
      margin: 0.5em 0;
      padding: 0.1em 1em;
      border-radius: 50px;
      background-color: var(--background-color);
      border: 1px solid var(--text-color);
    }
  }
</style>