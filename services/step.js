import {
  request
} from '../utils/TinyAppHttp'
import * as _ from "../utils/utils"
const MAX_ENCRYPT_BLOCK = 117;

async function encryptRSA(pubkey, data) {
  if (!data || !pubkey) {
    console.log("rsa no input")
    return ""
  }
  return new Promise((r, v) => {
    let text = data //JSON.stringify(data)
    console.log("rsa encryptRSA text", text)
    my.rsa({
      action: 'encrypt',
      text: text,
      // 设置公钥，需替换你自己的公钥
      key: pubkey,
      success: (result) => {
        if (result.text) {
          let bytes = _.base64ToArrayBuffer(result.text)
          // console.log("rsa",text,result,bytes) 
          r(bytes)
          return
        }
        v(result)
      },
      fail(e) {
        v(e)
      },
    });
  })
}
export default {
  getAes: async (data) => {
    const originData = await request(`/operation-free-bus/stepExchange/getUserSteps`, data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  //领取权益
  getStepsRights: async (data) => {
    let globalData = getApp().globalData
    try {
      let text = JSON.stringify(data)
      // console.log("rsa",text)
      const inputLen = text.length;
      let offSet = 0;
      let cache;
      let i = 0;
      let encrypt
      while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
          cache = await encryptRSA(globalData.pubkey, text.slice(offSet, offSet + MAX_ENCRYPT_BLOCK));
        } else {
          cache = await encryptRSA(globalData.pubkey, text.slice(offSet, offSet + inputLen - offSet));
        }
        encrypt = encrypt && cache && _.arrayBufferConcat(encrypt, cache) || cache
        // console.log("rsa encrypt",encrypt,cache)
        i++;
        offSet = i * MAX_ENCRYPT_BLOCK;
      }
      //let encrypt = await encryptRSA( globalData.pubkey,text)
      data = { data: _.arrayBufferToBase64(encrypt) }
    } catch (e) {
      console.warn("encryptRSA fail", e)
    }

    const originData = await request(`/operation-free-bus/stepExchange/exchangePrize`, data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  //权益首页接口
  getRightsState: async (data) => {
    const originData = await request(`/operation-free-bus/homePage/show`, data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  //步数兑换记录
  getStepsRightsRecordList: async (data) => {
    const originData = await request(`/operation-free-bus/stepExchange/exchangeList`, data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  //获取城市列表
  getCityList: async (params = {}, ) => {
    const originData = await request(`/operation-free-bus/admin/cityRelation/getCity`, {}, {
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
  queryUserVoucherInfo: async (data) => {
    const originData = await request(`/voucher/mappvoucher/queryUserVoucherInfo`, data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
}

