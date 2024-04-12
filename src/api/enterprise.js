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

export function delExterpriseAPI(id) {
    return request({
        url: `/park/enterprise/${id}`,
        method: 'DELETE'
    })
}
export function getRentBuildListAPI() {
    return request({
        url: '/park/rent/building'
    })
}
export function addRentAPI(data) {
    return request({
        url: '/park/enterprise/rent',
        method: 'post',
        data
    })
}
export function getRentListAPI(id) {
    return request({
        url: `/park/enterprise/rent/${id}`
    })
}

export function rentingOut(id) {
    return request({
        method: 'put',
        url: `/park/enterprise/rent/${id}`,

    })
}
export function getEnterpriseDetail(id) {
    return request({
        url: `/park/enterprise/${id}`,
        method: 'GET'
    })
}