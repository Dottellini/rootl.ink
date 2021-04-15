import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/home"
import Editor from '../views/editor'
import Register from '../views/register'
import Login from '../views/login'
import Userpage from "../views/Userpage";
import NotFound from "../views/NotFound";
import SignUpComplete from "../views/SignUpComplete";
import EmailConfirmation from "../views/EmailConfirmation";
import account from "../views/account";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signupcomplete',
    name: 'SignUpComplete',
    component: SignUpComplete,
  },
  {
    path: '/emailconfirmation',
    name: 'EmailConfirmation',
    component: EmailConfirmation,
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/account',
    name: 'Account',
    component: account
  },
  {
    path: '/:username',
    name: 'Userpage',
    component: Userpage,
  },
  {
    path: '/pagenotfound',
    name: 'PageNotFound',
    component: NotFound,
  }
  /*{
    path: '*',
    name: 'Not Found',
    component: NotFound
  },*/
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
