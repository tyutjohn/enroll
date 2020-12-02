import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import SuperAdmin from '../views/SuperAdmin'
import Admin from '../components/Admin'
import Chat from '../components/Chat'
import UserChat from '../views/UserChat'
import SysSetting from '../components/SysSetting'
import UserInform from '../components/UserInform'
import UserAdmission from '../components/UserAdmission'
import UserInterView from '../components/UserInterView'
import UserPass from '../components/UserPass'
import UserNoPass from '../components/UserNoPass'
import Error404 from '../views/Error404'
import store from '../store/index'

// 在引用vue-router的页面添加一段代码,解决vue-router重复调用promise的bug
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [{
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      auth: true
    },
    children: [{
      path: '/Admin',
      name: 'admin',
      component: Admin,
      meta: {
        auth: true
      }
    }, {
      path: '/Chat',
      name: 'chat',
      component: Chat,
      meta: {
        auth: true
      },
    },{
      path:'/SysSetting',
      name:'syssetting',
      component:SysSetting,
      meta:{
        auth:true
      }
    },{
      path:'/UserInform',
      name:'userinform',
      component:UserInform,
      meta:{
        auth:true
      }
    },{
      path:'/UserInterView',
      name:'userinterview',
      component:UserInterView,
      meta:{
        auth:true
      }
    },{
      path:'/UserAdmission',
      name:'useradmission',
      component:UserAdmission,
      meta:{
        auth:true
      }
    },{
      path:'/UserPass',
      name:'userpass',
      component:UserPass,
      meta:{
        auth:true
      }
    },{
      path:'/UserNoPass',
      name:'usernopass',
      component:UserNoPass,
      meta:{
        auth:true
      }
    }]
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/Error404',
    name: 'Error404',
    component: Error404
  }, {
    path: '/SuperAdmin',
    name: 'SuperAdmin',
    component: SuperAdmin
  }, {
    path: '/UserChat',
    name: 'UserChat',
    component: UserChat
  },
  {
    path: '*', //置于最底部
    redirect: '/Error404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 * 页面刷新，判断之前是否登陆
 */
if (window.sessionStorage.getItem('isLogin')) {
  store.dispatch('setAdmin', window.sessionStorage.getItem('userName'))
}

/**
 * 路由拦截器
 */
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    if (window.sessionStorage.getItem('userToken')) {
      if (window.sessionStorage.getItem('userName') == store.getters.getUsername) {
        next()
      } else {
        next({
          path: '/Login'
        })
      }
    } else {
      next({
        path: '/Login'
      })
    }
  } else {
    next()
  }
})

export default router