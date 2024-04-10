import axios from 'axios'
import store from '@/store/index'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.token
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response.status === 401) {
      // 401表示token过期
      router.push('/login')
      store.commit('removeToken')

    }
    Message.error(error.response.data.msg)  //对错误进行统一弹窗提示
    return Promise.reject(error)
  }
)

export default service
