import request from '@/utils/request'
export function uploadFile(form) {
  return request({
    url: 'upload',
    method: 'POST',
    data: form
  })
}
