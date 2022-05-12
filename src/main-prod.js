import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/globle.css'
import '@/assets/fonts/iconfont.css'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'

Vue.use(VueQuillEditor)

// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios
// axios请求的根路径
axios.defaults.baseURL = 'http://43.138.78.53:8889/api/private/v1'
// 为axios的请求头添加Authorization属性，方便登录后的验证
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 全局过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  // 年-月- 日 时:分:秒
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + 1 + '').padStart(2, '0')

  const hh = (dt.getHours() + 1 + '').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
