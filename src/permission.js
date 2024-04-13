// 路由组件中的内容太多了不好维护。
// 在这里写路由导航
import router from '@/router'
import store from '@/store/index'

import { getProfileAPI } from '@/api/user'

const whiteList = ['/login', '/404'] // 声明白名单
router.beforeEach(async(to, from, next) => {
  // to: 跳转的路由对象
  // from:从哪里来
  // next:放行next(),重定向next(路径)
  const token = store.state.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      // 登录之后，获取用户的权限信息
      const res = await getProfileAPI()
      console.log('用户权限信息res:', res)
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }

  next()
})
