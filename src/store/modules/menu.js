import { getProfileAPI } from '@/api/user'
// 导入静态路由
import { routes } from '@/router/index'
export default {
  namespaced: true,
  state: {
    // 权限标识
    permission: [],
    // 路由规则
    menuList: []

  },
  mutations: {
    // 修改权限标识
    setPermission(state, newpermission) {
      state.permission = newpermission
      // console.log('newPermission',newpermission);
    },
    // 修改路由规则
    setmenuList(state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes]
    }

  },
  getters: {

  },
  actions: {
    // 登录之后，获取用户的权限信息
    async getUserPermission(store) {
      const res = await getProfileAPI()
      console.log('用户权限信息res:', res)
      //   store.commit('setPermission',res.data.permission)
      //   console.log('res.data.permission:',res.data.permissions);
      store.commit('setPermission', res.data.permissions)
      return res.data.permissions
    }
  }
}
