import Vue from 'vue'
import VueRouter from 'vue-router'
import Editor from '../views/editor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Editor',
    component: Editor
  },
]

const router = new VueRouter({
  routes
})

export default router
