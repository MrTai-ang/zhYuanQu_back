import request from '@/utils/request'
/*

*/
export function getCardLsitAPI(params) {
  return request({
    url: '/parking/card/list',
    params
  })
}
export function addCardAPI(data) {
  return request({
    url: '/parking/card',
    data,
    method: 'POST'
  })
}
export function getCardDetailAPI(Id) {
  return request({
    url: `/parking/card/detail/${Id}`
  })
}
export function editCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}
export function delteCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE'
  })
}

