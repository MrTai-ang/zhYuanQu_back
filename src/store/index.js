import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import { loginAPI } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
Vue.use(Vuex)

const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    user
  },
  state: {
    token: getToken()

  },
  actions: {
    // 将后端数据存到state的规范写反需要经过actions,如果直接在组件中略过action不规范
    async loginaction(store, data) {
      const res = await loginAPI(data)
      console.log('res', res.data.token)
      store.commit('setToken', res.data.token)
    }
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
      setToken(newToken)
    },
    removeToken(state) {
      // 清除vuex中的token
      state.token = ''
      // 清除cookie中的token
      removeToken()
    }
  }
})

export default store
