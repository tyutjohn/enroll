import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueJsonp from 'vue-jsonp'

Vue.use(ElementUI)
Vue.use(VueAxios,axios)
Vue.use(VueJsonp)

Vue.config.productionTip = false

/**
 * 未认证拦截器
 */
axios.interceptors.response.use(
  response=>{
    return response
  },
  error=>{
    if(error.response){
      switch(error.response.status){
        case 401:
          confirm('登录时间过期，请重新登录')
          router.replace({
            path:'/Login'
          })
          location.reload()
      }
    }
    return Promise.reject(error.response.data)//返回接口的错误信息
  }
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

