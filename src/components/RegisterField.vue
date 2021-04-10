<template>
  <div class="container">
    <h1>Register</h1>
    <form class="form">
      <input type="text" v-model="username" maxlength="30" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="E-Mail" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <input type="password" v-model="rep_password" placeholder="Repeat Password" required>
      <button type="submit" @click="submit">Register</button>
    </form>
    <p class="error">{{error}}</p>
  </div>
</template>

<script>
export default {
  name: "RegisterField",
  data() {
    return {
      username: this.$store.state.username,
      email: "",
      password: "",
      rep_password: "",
      error: ""
    }
  },

  methods: {
    convertUsername: function (username) {
      let userArray = username.split("");
      let resultArray = [];

      for(let i = 0; i < userArray.length; i++) {
        if(userArray[i] === " ") {
          resultArray.push(i);
          userArray[i] = "_";
        }
      }

      return {
        username: userArray.join(""),
        indexArrayForSpaces: resultArray
      }
    },

    submit: function () {
      this.error = "";
      if(this.password !== this.rep_password) { this.error = "Passwords do not match!" }
      else {
        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.convertUsername(this.username),
            email: this.email,
            password: this.password
          }),
        })
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  },
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