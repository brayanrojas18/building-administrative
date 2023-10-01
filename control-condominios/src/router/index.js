import Vue from 'vue'
import VueRouter from 'vue-router'
import { SessionStorage } from 'quasar'
import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ( { store, ssrContext } ) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {

    // var role
    // var verific = true
    // if (store.state.example.user.data) {
    //   role = store.state.example.user.data.role
    // }else verific = false
    // console.log(SessionStorage.has('userData'), 'prueba')
    // console.log(store.state.example.user )

    // if(to.path == '/admin' && SessionStorage.has('userData') && verific && role == 'admin' || role == 'user')
    //   return next('/')
    // else return next('/login')

    var role
    if (store.state.example.user)
        role = store.state.example.user.role

    if (to.path !== '/login' && !SessionStorage.has('userData'))
      return next('/login')

    if(to.path == '/' && role == 'admin-general')
      return next('/admin')

    if(to.path == '/admin' && role == 'admin')
      return next('/dashboard')

    // if (SessionStorage.has('userData')) {
    //   if (store.state.example.user.data.role) {}
    // }

    next()
  })


  return Router
}
