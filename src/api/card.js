import request from '@/utils/request'
/*

*/
export function getCardLsitAPI(params) {
  return request({
    url: '/parking/card/list',
    params
  })
}
