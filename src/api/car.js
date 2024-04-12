import request from '@/utils/request'
// 计费规则管理的接口
export function getRuleListAPI(params) {
  return request({
    url: 'parking/rule/list',
    params
  })
}

export function addRuleAPI(data) {
  return request({
    method: 'post',
    url: 'parking/rule',
    data
  })
}
