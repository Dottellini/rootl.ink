import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/home"
import Editor from '../views/editor'
import Register from '../views/register'
import Login from '../views/login'
import Userpage from "../views/Userpage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/:username',
    name: 'Userpage',
    component: Userpage
  },
]

const router = new VueRouter({
  routes
})

export default router
