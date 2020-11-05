import {
  request
} from '../utils/TinyAppHttp'


// v2.5

export default {
  //获取红包任务
  getRedBegTask: async (params = {}, alipayId) => {
    var getJSON = function() {
      var promise = new Promise(async (resolve, reject) => {
        const originData = await request(`/operation-free-bus/api/redEnvelopeTask/homepage?accountId=${alipayId}`, {}, {
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
          const res = {
            success: true,
            data: originData.data
          }
          resolve(res)
        } else {
          reject({
            success: false
          })
        }
      });
      return promise;
    };
    let response = ''
    await getJSON().then((res) => {
      // console.log('res', res)
      response = res
    }, (error) => {
      response = error
      console.error('出错了', error);
    });
    return response

  },
  //领取红包任务
  receiveRedBegTask: async (params = {}, alipayId, taskId) => {
    var getJSON = function() {
      var promise = new Promise(async (resolve, reject) => {
        const originData = await request(`/operation-free-bus/api/redEnvelopeTask/add?accountId=${alipayId}&taskId=${taskId}`, {}, {
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
          resolve()
        }
      });
      return promise;
    };
    await getJSON().then(function(res) {
    }, function(error) {
      console.error('出错了', error);
    });
    return
  },
  //获取分享任务列表
  getShareTaskList: async (params = {}, alipayId) => {
    const originData = await request(`/operation-free-bus/api/inviteTask/getInviteTask?accountId=${alipayId}`, '', {
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
  //领取分享任务
  receiveShareTaskList: async (params = {}, alipayId, taskId) => {
    const originData = await request(`/operation-free-bus/api/inviteTask/addNewUser?accountId=${alipayId}&taskId=${taskId}`, '', {
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
  //新手引导
  needNewerPop: async (params = {}, alipayId) => {
    const originData = await request(`/operation-free-bus/account/isNewAccount?alipayId=${alipayId}`, '', {
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
  //新手引导做完
  newerPopDown: async (params = {}, alipayId) => {
    const originData = await request(`/operation-free-bus/account/changeAccountToNotNew?alipayId=${alipayId}`, '', {
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
