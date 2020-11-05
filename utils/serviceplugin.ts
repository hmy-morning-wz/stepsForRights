
import { CALL_AJAX, CALL_RPC } from './symbols';
import {
  request
} from './TinyAppHttp'

 function getStorageSync(data:any):Promise<any>  {
    let { key } = data
    return new Promise((resolve, reject) => {
      my.getStorage({
        key: key,
        success: (res) => {

          resolve(res)
        },
        fail: () => {
          reject()
        }
      })
    })
  }
  function sleep(time: any){
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve()
        }, time || 0)
      } catch (e) {
        reject(e);
      }
    });
  }
async function call_ajax(store:any,payload:any){
  const {
        type        
      } = payload;
      let types: string[] = []


      if (type) {
        const largerType = type.toUpperCase();
        types = [
          `${largerType}_REQUEST`,
          `${largerType}_SUCCESS`,
          `${largerType}_FAILURE`
        ];
      }
      if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
      }
      const [requestType, successType, failureType] = types;      
      store.commit(requestType, {
        path: ['$loading', type],
        value: { isLoading: true, request: payload, type:"LOADING"}
      }, '$setIn');
      
      let { url,
        data,
        mock,
        method,
        cache,
        retry,
        businessConfig,
      } = payload
      let key = "_AJAX:"+method+":"+url
      if(cache) {
        let storage=  await getStorageSync({key})
        let response =storage && storage.data
        if(response && !response.API_ERROR && response.timestamp &&  (+Date.now() - response.timestamp) < 10 * 60000) 
        {
           store.commit(successType, {
            path: ['$loading', type],
            value: { isLoading: false, request: payload, type: 'SUCCESS',cache }
          }, '$setIn');
          store.commit(`SET_${type.toUpperCase()}_RESULT`, {
            path: ['$result', type],
            value: response.data || response
          }, '$setIn');      
          return (response)
        }
      }
      try {
        let requestCount = 0
        do{
        requestCount++
        let response = await request(url, data, mock, method, businessConfig)
        if (response && !response.API_ERROR) {//{"code":"40004","msg":"Business Failed","sub_code":"40004","sub_msg":"该用户当日抽奖次数已用完"}
          let {code,msg,sub_code,sub_msg} = response
          store.commit(successType, {
            path: ['$loading', type],
            value: { isLoading: false, request: payload, type: 'SUCCESS',requestCount,code,msg,sub_code,sub_msg }
          }, '$setIn');
          store.commit(`SET_${type.toUpperCase()}_RESULT`, {
            path: ['$result', type],
            value: response.data || response
          }, '$setIn');
          if(cache) {
            response.timestamp = +Date.now()
             my.setStorage({
              key,
              data:response,            
             })
          }
          /*
        if (response && response.entities) 
         {
          store.commit('setEntities', response);
          } 
          */
        } else {
          store.commit(failureType, {
            path: ['$loading', type],
            value: { isLoading: false, request: payload, type: 'FAILURE', response,requestCount }
          }, '$setIn');
          if(retry) {
            console.warn("retry request",requestCount,url)
            await sleep(1000*requestCount)
            continue;
          }
        }
       
        return (response)

        }while(retry && requestCount<3)



      } catch (e) {
        store.commit(failureType, {
          path: ['$loading', type],
          value: { isLoading: false, request: payload, type: 'FAILURE', response: "" + e }
        }, '$setIn');
        return Promise.reject(e);
      }
}  

export default function plugin(option: any = {}) {
  return [function (store: any) {
    /*
    store.subscribe((mutation:any, state:any, prevState:any) => {}, async (action: any, next: any) => {
      if (![CALL_AJAX, CALL_RPC].includes(action.type)) {
        return next();
      }
      if (action.type !== CALL_AJAX) return next();
      const { payload } = action;
      

      //return next();
    });*/
  }, (config: any) => { // 第二个是config
    /*    
      if (option.normalize) {
        config.state.$entities = {};
      }*/
    Object.assign(config.state, {
      $loading: {},
      $result: {}
    });
    config.actions[CALL_AJAX] = call_ajax

    
    /*
    Object.assign(config.mutations, {
      $setEntities(state:any, payload:any) {
        Object.assign(state.$entity, payload.entities);
      }
    });*/
  }]
}