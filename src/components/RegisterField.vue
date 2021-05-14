<template>
  <div class="container">
    <h1>{{$t('register')}}</h1>
    <form class="form">
      <input type="text" v-model="username" maxlength="30" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="E-Mail" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <input type="password" v-model="rep_password" placeholder="Repeat Password" required>
      <button type="button" @click="submit">{{$t('register')}}</button>
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

  mounted() {
    if(this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  },

  methods: {
    /*convertUsername: function (username) {
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
    },*/

    submit: function () {
      this.error = "";
      let inputs = document.getElementsByTagName("input");
      for (let item of inputs) {
        if(item.value === "") {
          this.error="Please fill all Fields"
          return;
        }
      }
      if(this.password.length < 8) { this.error = "Password must be at least 8 characters" }
      else if(this.password !== this.rep_password) { this.error = "Passwords do not match!" }
      else {
        let complication = "";
        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          }),
        })
          .then(data => {
            let reader = data.body.getReader();
            reader.read().then(function processText({done, value}) {
              if(done) return
              let string = new TextDecoder().decode(value)
              let data = JSON.parse(string)
              if(data.result === "OK") {
                return reader.read().then(processText);
              } else if(data.result === "WARNING" || data.result === "ERROR") {
                complication = data.message
              }
            }).then(() => {
              if(complication === "") {
                this.$router.push({name: "SignUpComplete"})
              } else {
                this.error = complication
              }
            })
          })
          .catch((error) => {
            console.log(error)
            this.error = "There was an error"
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

  p {
    font-family: 'Montserrat', sans-serif;
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