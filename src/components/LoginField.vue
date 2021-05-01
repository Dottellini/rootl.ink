<template>
  <div class="container">
    <h1>{{$t('login')}}</h1>
    <!--<GoogleLogin></GoogleLogin>-->
    <h3>{{$t('or')}}</h3>
    <form class="form">
      <input type="username" v-model="username" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="button" @click="submit">{{$t('login')}}</button>
    </form>
    <p class="error">{{error}}</p>
  </div>
</template>

<script>
import GoogleLogin from "./GoogleLogin";
export default {
  name: "LoginField",
  components: {
    GoogleLogin
  },
  data() {
    return {
      username: "",
      password: "",
      error: ""
    }
  },

  mounted() {
    if(this.$store.state.isLoggedIn) {
      this.$router.push({name: "Home"})
    }
  },

  methods: {
    submit: function () {
      this.error = "";
      let inputs = document.getElementsByTagName("input");
      for (let item of inputs) {
        if(item.value === "") {
          this.error="Please fill all Fields"
          return;
        }
      }
      let complication = "";
      let username = "";
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          username: this.username,
          password: this.password
        }),
        mode: "cors"
      }).then(result => {
        result.headers.forEach(header => {
          if(header === "ERROR") {this.error = "Wrong Credentials"} //this.$t('error')
          else if(header === "WARNING") {this.error = "Please confirm your E-Mail"}
        })
        let reader = result.body.getReader();
        reader.read().then(function processText({ done, value }) {
          if (done) return;
          let string = new TextDecoder().decode(value);
          let data = JSON.parse(string)
          if(data.result === "WARNING" || data.result === "ERROR") {
            complication = data.message
          } else if(data.result === "OK") {
            username = data.username;
            localStorage.setItem('username', data.username);
            return reader.read().then(processText);
          }
        }).then(() => {
          if(complication === "") {
            this.$store.commit("login", username);
            this.$router.push({name: "Home"});
          } else {
            this.error = complication
          }
        })
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
  h1, h3{
    font-family: 'Montserrat', sans-serif;
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