import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/globle.css'
import '@/assets/fonts/iconfont.css'
import axios from 'axios'

// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios
// axios请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 为axios的请求头添加Authorization属性，方便登录后的验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
