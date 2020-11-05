import {
  request
} from '../utils/TinyAppHttp'


// 接口请求地址
// const path = '/prefer/icon/getByParam'
export default {
  //获取UserId
  getUserId: async (params = {}, cityCode) => {
    let userId = '';
    var getJSON = function() {
      var promise = new Promise(function(resolve, reject) {
        my.getAuthCode({
          success: async (res) => {
            const auth = res.authCode
            const obj = {
              cityCode: cityCode,
              authCode: res.authCode,
            }
            const originData = await request(`/operation-free-bus/account/getUserAccountIdAndAddress`, obj, {
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
               const obj = {
                 userId:originData.data.userId,
                 accountId:originData.data.accountId,
               }
              resolve(obj)
              return {
                success: true
              }
            }
            my.hideLoading()
            return {
              success: false
            }
          },
        })
      });
      return promise;
    };
    await getJSON().then(function(res) {
      userId = res
    }, function(error) {
      console.error('出错了', error);
    });
    return userId
  },
  //获取积分接口
  getUserPoint: async (params = {}, userId) => {
    const originData = await request(`/operation-free-bus/account/getUserPoint?accountId=${userId}`, {}, {
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
  //获取轮播图接口
  getBanner: async (params = {}, cityCode) => {
    const originData = await request(`/operation-free-bus/advertisement/bannerList?cityCode=${cityCode}&position=index`,{}, {
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
  //获取城市列表
  getCityList: async (params = {}, ) => {
    const originData = await request(`/operation-free-bus/task/getCityList`, {}, {
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
  //当前可兑换的奖品接口
  getAvailableExchange: async (params = {}, userId, cityCode) => {
    const originData = await request(`/operation-free-bus/reward/getAvailableExchange?accountId=${userId}&cityCode=${cityCode}`,'', {
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
  //公告轮播接口
  getHomePageList: async (params = {}, cityCode) => {
    const originData = await request(`/operation-free-bus/announcement/homePageList`,{}, {
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
  //列表接口
  getTaskList: async (params = {}, userId, type, cityCode) => {
    const originData = await request(`/operation-free-bus/taskMiniApp/taskList?accountId=${userId}&type=${type}&cityCode=${cityCode}`,{}, {
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
  //品牌专区列表
  getTaskList: async (params = {}, userId, type, cityCode) => {
    const originData = await request(`/operation-free-bus/taskMiniApp/taskList?accountId=${userId}&type=${type}&cityCode=${cityCode}`,{}, {
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
  //获取弹框接口
  getTaskPoupon: async (params = {}, userId, taskId) => {
    const originData = await request(`/operation-free-bus/taskMiniApp/popup?accountId=${userId}&taskId=${taskId}`,'', {
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
  //判断是否收藏
  getIsCollection: async (params = {},userId) => {
    const originData = await request(`/operation-free-bus/taskRecord/isCollect?accountId=${userId}&taskId=-1`,'', {
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
    if (!originData.API_ERROR && originData.msg === 'Success') {
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
        duration: 500,
      });
    }
    return {
      success: true,
      // data: originData.data
    }
    
  },
   //发模版消息接口
  sendMessage: async (params = {}, userId, taskId, formId) => {
    const obj = {
      "formId": formId,
      "userId": userId,
      "taskId": taskId,
      "completionStatus": 3,
    }
    const originData = await request(`/operation-free-bus/taskMiniApp/addTaskRecord`, obj, {
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
    return {
      success: true,
      // data: originData.data
    }
   
  },
  //获取任务弹窗接口
  getCouponPupon: async (params = {}, userId) => {
    const originData = await request(`/operation-free-bus/taskMiniApp/rewardPopup?accountId=${userId}`,{}, {
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
