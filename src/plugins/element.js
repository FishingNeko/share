import Vue from 'vue'
import { Button, Form, FormItem, Input, Dialog, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Dialog)
// 弹框提示需全局挂载
Vue.prototype.$message = Message
