import {
  request
} from '../utils/TinyAppHttp'


// 接口请求地址
// const path = '/prefer/icon/getByParam'
export default {

  //获取任务列表接口
  getCompletionTaskList: async (params = {}, userId, ) => {
    const obj = {
      userId: userId
    }
    const originData = await request(`/operation-free-bus/taskMiniApp/getCompletionTaskList?userId=${userId}`,{}, {
      on: false,
      data: {}
    }, 'post', {
        urlType: 'devDomain',
        headers: {
          'content-type': 'application/json; charset=UTF-8'
        }, // headers 定制传输
        authType: false // 授权类型auth_base/auth_user
      })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    my.hideLoading()
    return {
      success: false
    }
  },
  getRecordList: async (params = {}, userId, ) => {
    const obj = {
      userId: userId
    }
    const originData = await request(`/operation-free-bus/reward/rewardExchangeRecord`, obj, {
      on: false,
      data: {}
    }, 'post', {
        urlType: 'devDomain',
        headers: {
          'content-type': 'application/json; charset=UTF-8'
        }, // headers 定制传输
        authType: false // 授权类型auth_base/auth_user
      })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    my.hideLoading()
    return {
      success: false
    }
  },
  // 新赏金明细 v2.5
  getPointChangeList: async (params = {}, userId, ) => {
    const originData = await request(`/operation-free-bus/api/point/getPointChangeList?userId=${userId}`, {}, {
      on: false,
      data: {}
    }, 'get', {
        urlType: 'devDomain',
        headers: {
          'content-type': 'application/json; charset=UTF-8'
        }, // headers 定制传输
        authType: false // 授权类型auth_base/auth_user
      })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    my.hideLoading()
    return {
      success: false
    }
  },
}
