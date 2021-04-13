import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/home"
import Editor from '../views/editor'
import Register from '../views/register'
import Login from '../views/login'
import Userpage from "../views/Userpage";
import NotFound from "../views/NotFound";
import SignUpComplete from "../views/SignUpComplete";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signupcomplete',
    name: 'SignUpComplete',
    component: SignUpComplete
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      guest: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/:username',
    name: 'Userpage',
    component: Userpage
  },
  /*{
    path: '*',
    name: 'Not Found',
    component: NotFound
  },*/
]

const router = new VueRouter({
  //mode: "history",
  routes
})

export default router
