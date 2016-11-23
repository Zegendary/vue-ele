import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import goods from 'components/goods/goods.vue'
import ratings from 'components/ratings/ratings.vue'
import sellers from 'components/seller/seller.vue'

Vue.use(VueRouter)
/* eslint-disable no-new */

let routes = [
  {
    path: '/goods', component: goods
  },
  {
    path: '/ratings', component: ratings
  },
  {
    path: '/sellers', component: sellers
  }
]
const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.push('/goods')
