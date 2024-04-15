// 路由组件中的内容太多了不好维护。
// 在这里写路由导航
import router from '@/router'
import store from '@/store/index'
// 导入动态路由
import asyncRoutes from '@/router/asyncRoutes'
// 获取一级权限的标识
function getFirstRoutePermission(permission) {
  const firstpermission = permission.map(item => {
    return item.split(':')[0]
  })
  // 去重
  return Array.from(new Set(firstpermission))
}
function getSeccondRoutePermission(permission) {
  const secondpermission = permission.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  // 去重
  return Array.from(new Set(secondpermission))
}
function getRoutes(firstPermission, secondPermission, asyncRoutes) {
  // 判断当前登录人是不是管理员,如果是管理员，则不用进行筛选，返回全部路由
  if (firstPermission.includes('*'))
  {
    return asyncRoutes
    }
  const firstRoutes = asyncRoutes.filter(item => firstPermission.includes(item.permission))
  console.log('firstRoutes', firstRoutes)
  const routes = firstRoutes.map(item => {
    return {
      ...item,
      children: item.children.filter(child => secondPermission.includes(child.permission))
    }
  })
  return routes
}

// import { getProfileAPI } from '@/api/user'

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
      // 1.调用用户权限信息，并将其存储到vuex中
      const permission = await store.dispatch('menu/getUserPermission')
      console.log('permission:', permission)
      // 2.根据权限标识，筛选出对应的一级路由
      const firstPermission = getFirstRoutePermission(permission)
      console.log('first:', firstPermission)
      // 3.根据权限标识，筛选出对应的二级路由
      const secondPermission = getSeccondRoutePermission(permission)
      console.log('second:', secondPermission)
      // 4.根据一级权限标识和二级权限标识和动态路由进行筛选
      console.log('asynroutes:', asyncRoutes)
      const routes = getRoutes(firstPermission, secondPermission, asyncRoutes)
      console.log('routes:', routes)
      // 5.把筛选后的路由展示在左侧
      // 5.1把筛选之后的路由添加到路由对象中(跳转)
      routes.forEach(item => {
        router.addRoute(item)
      })
      // 在把筛选之后的路由添加到vuex之中(渲染)
      store.commit('menu/setmenuList', routes)
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
