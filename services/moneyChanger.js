import {
  request
} from '../utils/TinyAppHttp'


// 接口请求地址
// const path = '/prefer/icon/getByParam'
export default {
    //公告轮播接口
  getExchangeList: async (params = {}) => {
    const originData = await request(`/operation-free-bus/announcement/exchangeList`,{}, {
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
    //获取奖品列表接口
  getRewardList: async (params = {},cityCode) => {
    const obj = {
      "cityCode": cityCode,
    }
    const originData = await request(`/operation-free-bus/reward/rewardList`,obj, {
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
    //获取奖品列表接口
  getRewardPupon: async (params = {},rewardId) => {
    const originData = await request(`/operation-free-bus/reward/popup?rewardId=${rewardId}`,'', {
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
  //兑换积分接口
  exchangeReward: async (params = {}, userId, rewardId) => {
    const obj = {
      "rewardId": rewardId,
      "userId": userId,
    }
    const originData = await request(`/operation-free-bus/reward/exchangeReward`, obj, {
      on: false,
      data: {}
    }, 'post', {
        urlType: 'devDomain',
        headers: {
          'content-type': 'application/json; charset=UTF-8'
        }, // headers 定制传输
        authType: false // 授权类型auth_base/auth_user
      })
    console.log(originData)
    // 数据处理
    if (originData.code == 20000) {
      my.showToast({
        type: 'success',
        content: '兑换成功',
        duration: 500,
      });
    } else {
      my.showToast({
        type: 'fail',
        content: originData.sub_msg,
        duration: 1000,
      });
    }
    return {
      success: true,
      // data: originData.data
    }

  },
}
