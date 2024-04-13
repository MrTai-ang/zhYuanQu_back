import request from '@/utils/request'
export function getRoleListAPI(params) {
  return request({
    url: '/park/sys/role',
    params
  })
}

export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}

export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

export function getRoleUserListAPI(roleId, params) {
  return request({
    url: `/park/sys/roleUser/${roleId}`,
    params
  })
}
