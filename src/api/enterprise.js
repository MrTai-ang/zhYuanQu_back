import request from '@/utils/request'

export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  }
  )
}
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}
export function AddEnterprise(data) {
  return request({
    url: '/park/enterprise',
    method: 'post',
    data
  })
}
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}
export function updateExterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}
