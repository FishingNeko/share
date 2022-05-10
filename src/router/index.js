import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login.vue'
// import Home from '@/components/Home.vue'
// import Welcome from '@/components/HomeInnerCompontes/Welcome.vue'
// import Users from '@/components/HomeInnerCompontes/HomeMainInnerComponets/user/Users.vue'
// import Rights from '@/components/HomeInnerCompontes/HomeMainInnerComponets/power/Rights.vue'
// import Roles from '@/components/HomeInnerCompontes/HomeMainInnerComponets/power/Roles.vue'
// import Cate from '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/Cate.vue'
// import Params from '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/Params.vue'
// import Goods from '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/Goods.vue'
// import Orders from '@/components/HomeInnerCompontes/HomeMainInnerComponets/orders/Orders.vue'
// import Reports from '@/components/HomeInnerCompontes/HomeMainInnerComponets/reports/Reports.vue'
// import AddGoods from '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/AddGoods.vue'

// 路由懒加载
const Login = () =>
  import(/* webpackChunkName: "Login-Home-Welcome" */ '@/components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "Login-Home-Welcome" */ '@/components/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "Login-Home-Welcome" */ '@/components/HomeInnerCompontes/Welcome.vue'
  )

const Users = () =>
  import(
    /* webpackChunkName: "Users-Rights-Roles" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/user/Users.vue'
  )
const Rights = () =>
  import(
    /* webpackChunkName: "Users-Rights-Roles" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/power/Rights.vue'
  )
const Roles = () =>
  import(
    /* webpackChunkName: "Users-Rights-Roles" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/power/Roles.vue'
  )

const Cate = () =>
  import(
    /* webpackChunkName: "Cate-Params" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/Cate.vue'
  )
const Params = () =>
  import(
    /* webpackChunkName: "Cate-Params" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/Params.vue'
  )

const Goods = () =>
  import(
    /* webpackChunkName: "Goods-AddGoods" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/Goods.vue'
  )
const AddGoods = () =>
  import(
    /* webpackChunkName: "Goods-AddGoods" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/goods/AddGoods.vue'
  )

const Orders = () =>
  import(
    /* webpackChunkName: "Orders-Reports" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/orders/Orders.vue'
  )
const Reports = () =>
  import(
    /* webpackChunkName: "Orders-Reports" */ '@/components/HomeInnerCompontes/HomeMainInnerComponets/reports/Reports.vue'
  )

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/home/welcome',
    component: Home,
    children: [
      { path: 'welcome', component: Welcome },
      { path: 'users', component: Users },
      { path: 'rights', component: Rights },
      { path: 'roles', component: Roles },
      { path: 'categories', component: Cate },
      { path: 'params', component: Params },
      { path: 'goods', component: Goods },
      { path: 'orders', component: Orders },
      { path: 'reports', component: Reports },
      { path: 'goods/add', component: AddGoods }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 登录的路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
