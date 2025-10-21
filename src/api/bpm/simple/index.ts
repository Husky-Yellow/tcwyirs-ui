import request from '@/config/axios'

/** @deprecated 该接口已废弃，请勿再使用 */
export const updateBpmSimpleModel = async (data) => {
  return await request.post({
    url: '/bpm/model/simple/update',
    data: data
  })
}

/** @deprecated 该接口已废弃，请勿再使用 */
export const getBpmSimpleModel = async (id) => {
  return await request.get({
    url: '/bpm/model/simple/get?id=' + id
  })
}
