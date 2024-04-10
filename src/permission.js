// 路由组件中的内容太多了不好维护。
// 在这里写路由导航
import router from '@/router'
import store from '@/store/index'
const whiteList = ['/login', '/404'] //声明白名单
router.beforeEach((to, from, next) => {
    //to: 跳转的路由对象
    // from:从哪里来
    // next:放行next(),重定向next(路径)
    const token = store.state.token
    if (token) {
        if (to.path === '/login') {
            next('/')
        } else {
            next()
        }
    }
    else {
        if (whiteList.includes(to.path)) {
            next()
        }
        else {
            next('/login')
        }
    }

    next()
})