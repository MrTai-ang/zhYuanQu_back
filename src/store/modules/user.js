
// import { loginAPI } from "@/api/user"
export default {
  namespaced: true,
  state: {
    // token: ''

  },
  // actions: {
  //   // 将后端数据存到state的规范写反需要经过actions,如果直接在组件中略过action不规范
  //   async loginaction(store, data) {
  //     console.log('nihapo');
  //     const res = await loginAPI(data)
  //   }
  // },
  mutations: {
    setToken(state, newval) {
      state.token = newval
    }
  },
  actions: {}
}
