
//declare var $global: any
import getDomain,{setEnv} from './httpEnv';
const HOST_BASE_URL = 'https://ztmanage.allcitygo.com:8192'//'https://sit-basic-ug.allcitygo.com'//sit-tcapp-gateway.allcitygo.com'// 'http://172.31.254.206:5002'// 'https://ztmanage.allcitygo.com:8192' // 'https://sit-basic-ug.allcitygo.com'
const APP_VERSION = '1.0.0'


const TAG = '[REQUEST]'


const TIMEOUT = 10000;

function logger(tag: string, ...payload: any[]) {
    console.debug(`%c ${TAG}[${tag}]`, 'color: #9E9E9E; font-weight: bold', ...payload);
}

const qs = {
    parse: function (str: string) {
        if (!str || str.length == 0) return {}
        let list = str.split('&')
        if (!list || list.length == 0) return {}
        let out: any = {}
        for (let index = 0; index < list.length; index++) {
            let set = list[index].split('=')
            set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]))
        }
        return out
    },
    stringify: function (data: any) {
        if (!data) return ''
        let list = []
        for (let key in data) {
            if (data[key] instanceof Array && data[key].length) {
                data[key].forEach((t: any) => {
                    list.push(key + '=' + encodeURIComponent(t))
                })
            }
            else {
                list.push(key + '=' + encodeURIComponent(data[key]))
            }
        }
        return list.join('&')
    }
}
function updateUserId(userId:string){
    if(userId) {
     let app:any=   getApp()
     app.userId = userId
     let globalData =app.globalData
     globalData.userId = globalData.alipayId 
     let Tracker = app.Tracker
     Tracker && Tracker.setUserId(userId)
    }
}

/**
 * 获取用户的Token信息并发送异步求情
 * @param {*} config
 * _request_ 的第一个参数必须是url
 */
function _request_(httpConfig: TinyAppHttpConfig, requsetConfig: TinyAppHttpRequset) {
    let {
        url,
        method,
        data,
        headers,
        timeout,
    } = requsetConfig;

    headers = Object.assign(getDefaultHeader(httpConfig), headers)
    if (!headers['content-type']) headers['content-type'] = 'application/json'
    if (headers['content-type'] && headers['content-type'].indexOf('application/json') > -1) {
        data = JSON.stringify(data)
    }

    logger('my.request', method, url, headers, data);

    let t0 = +Date.now()
    return new Promise((resolve, reject) => {
        try {
            my.request({
                url,
                method,
                headers,
                data,
                timeout: timeout || TIMEOUT,
                success: res => {
                    let t1 = +Date.now()
                    let spendTime = t1 - t0
                    logger('my.request spendTime', url, spendTime);
                      resolve(res.data);
                },
                fail: error => {
                    //{data: {…}, headers: {…}, status: 400, error: 19, errorMessage: "http status error"}
                    //status: 401
                    console.warn(TAG + "request fail", url)
                    if (error.status === 401 || error.status === 403) {
                        return resolve({ code: "401" });
                    }
                    reject(error);
                },
                complete: () => {


                }
            })
        } catch (e) {
            console.warn(TAG + "request catch error", e)
            reject(e);
        }
    });
}

class InterceptorManager {
    handlers: { fulfilled: Function, rejected: Function, isAutoAuth: boolean }[] = [];
    constructor() {
    }

    use(fulfilled: Function, rejected: Function, autoAddAuth = false) {
        this.handlers.unshift({
            fulfilled: fulfilled,
            rejected: rejected,
            isAutoAuth: autoAddAuth
        });
        return this.handlers.length - 1;
    }

    forEach(fn: Function) {
        const newHandles: { fulfilled: Function, rejected: Function, isAutoAuth: boolean }[] = [];
        this.handlers.forEach(h => {
            if (h !== null) {
                fn(h);
            }
            /*
              if (!h.isAutoAuth) {
                newHandles.push(h);
              }*/
        });
        this.handlers = newHandles;
    }
}


function silenceAuthCode() {
    return new Promise((resolve, reject) => {
        try {
            my.getAuthCode({
                scopes: 'auth_base',
                success: (res) => {
                    resolve(res);
                },
                fail: () => {
                    reject();
                    /*
                      my.alert({
                          title: '授权失败，请稍后再试',
                          complete: () => reject(res)
                      });
                      */
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function getSystemInfoSync(): Promise<SystemInfo> {
    return new Promise(async (resolve, reject) => {
        let deviceId=""
        let ret: any = await getStorageSync({ key: 'devId' })        
        if (ret && ret.data) {
            deviceId = ret.data
        } else {
            deviceId = guid()
               let globalData = getApp().globalData
               if (globalData) { globalData.set('devId', deviceId) }
                  else {
                     my.setStorage({ key: 'devId', data: deviceId })
                }            
        }
        let systemInfo: any

        //@ts-ignore
        let loading = (my.$mySystemInfo && my.$mySystemInfo.loading)
        if (loading) {
            let count = 0
            do {
                await sleep(50)
                //@ts-ignore
                if (my.$mySystemInfo && my.$mySystemInfo.success) {
                    //@ts-ignore
                    systemInfo = my.$mySystemInfo
                    systemInfo.deviceId =systemInfo.deviceId  || deviceId
                    break
                }               
            } while (count++ < 10)
        }else {
             //@ts-ignore
            systemInfo = my.$mySystemInfo
        }
         
        if (systemInfo && systemInfo.success) {
            console.log("TinyAppHttp getSystemInfoSync from systemInfo")
            systemInfo.deviceId = systemInfo.deviceId || deviceId
            return resolve(systemInfo)
        }
     
        my.getSystemInfo({
            success: async (res: my.IGetSystemInfoSuccessResult) => {
                let systemInfo: SystemInfo = <SystemInfo>res
                systemInfo.deviceId =deviceId                
                resolve(systemInfo)
            },
            fail: () => {
                reject()
            }
        })
    })
}

function sleep(time: number) {
    logger('sleep', time)
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                logger('sleep timeout')
                resolve()
            }, time || 1000)
        } catch (e) {
            reject(e);
        }
    });
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
        var t = 16 * Math.random() | 0,
            r = 'x' === e ? t : 3 & t | 8;
        return r.toString(16);
    });
}
function makeUrl(url: string, data: any) {
    let index = url && url.indexOf('?')
    return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data)
}


function getDefaultHeader(data: TinyAppHttpConfig) {   
    let APP_ID = data.appId || getApp().globalData.appId
    if (!APP_ID) {
         // @ts-ignore
        const { appId } = (my.canIUse('getAppIdSync') && my.getAppIdSync()) || {}
        APP_ID = appId
        console.log("APP_ID", APP_ID)
    }

    let res: any = {
        // 'Authorization': 'Bearer '+data.access_token,
        'app_id': APP_ID,
        'app_version': data.appVersion || APP_VERSION, //$global.appVersion 
        'device_id': data.deviceId,
        'device_os': data.platform,
        'device_name': data.model,
    }
    if (data.access_token) {
        res.access_token = data.access_token
        res.Authorization = 'Bearer ' + data.access_token
    }
    return res
}


async function   getStorageSync(data: any) {
    let { key } = data
    console.log("getStorageSync ",key)
    let globalData = getApp().globalData
    if(globalData)
    {  let res =await globalData.get(key)
        return  {data:res}
    }
    else return new Promise((resolve, reject) => {
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

async function loadToken(): Promise<Token> {
    let res: any = await getStorageSync({ key: 'access_token' })
    let now = +Date.now()
    if (res && res.data  && res.data.expireTime > now) {
        logger('loadToken success', res.data.expireTime);
        return res.data
    } else {
        logger('loadToken none', res);
        return {
            success: false
        }
    }
}
abstract class TinyAppHttpBase {
    ready = false
    _request_id = 0
    defaults: TinyAppHttpConfig = {

    }
    hostBaseUrl: string
    interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    };
    sendList: Send[] = []
    constructor(instanceConfig: TinyAppHttpConfig | undefined) {
        instanceConfig && (Object.assign(
            this.defaults,
            instanceConfig
        ))
        this.hostBaseUrl = instanceConfig && instanceConfig.hostBaseUrl || HOST_BASE_URL

    }
    logger(tag: string, _request_id?: string | number, ...payload: any[]) {
        console.debug(`%c${TAG}[%d][${tag}]`, 'color: #9E9E9E; font-weight: bold', _request_id||0, ...payload);
    }
    autoAddLogger(requsetConfig: TinyAppHttpRequset) {
        this.interceptors.request.use(
            async (request: any) => {
                this.logger('interceptors request', requsetConfig._request_id, request);
                return request;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
        this.interceptors.response.use(
            async (response: any) => {
                this.logger('interceptors response', requsetConfig._request_id, response);

                //my.hideLoading({});
                return response;
            },
            (error: any) => {
                this.logger('interceptors response error', requsetConfig._request_id, error);
                //my.hideLoading({});
                return Promise.reject(error);
            }
        );
    }

    dispatchRequest() {
        //let that = this
        // 这里是请求的真正发起地方返回promise
        return (requsetConfig: TinyAppHttpRequset) => {
            return _request_(this.defaults, requsetConfig)
        }
    }

    request(requsetConfig: TinyAppHttpRequset,needToken:boolean = true) {
        try {
            requsetConfig._request_id = this._request_id++

            // 参数结构({url: '', data: {}, method: '', headers: {}})       
            // 合并参数
            //config = { ... this.systemInfo, ...this.defaults, ...config };
            requsetConfig.method = requsetConfig.method || 'GET';
            requsetConfig.headers = requsetConfig.businessConfig.headers || {};
            if (requsetConfig.method === 'GET') {
                if (requsetConfig.data && typeof requsetConfig.data === 'object' && Object.keys(requsetConfig.data).length) {
                    requsetConfig.url = makeUrl(requsetConfig.url, requsetConfig.data)
                }
                delete requsetConfig.data
            } else {
                requsetConfig.data = requsetConfig.data || {}
            }
            // config.data = config.method === 'get' ? undefined : (config.data || {});
            if (requsetConfig.url.indexOf('https:') == -1 && requsetConfig.url.indexOf('http:') == -1) {
                requsetConfig.url = requsetConfig.url.indexOf('/') == 0 ? this.hostBaseUrl + requsetConfig.url : this.hostBaseUrl + '/' + requsetConfig.url
            }

            this.autoAddLogger(requsetConfig)
            needToken && this.defaults.autoToken && this.autoAddAuthorization(requsetConfig);


            // 载入拦截器
            let chain = [this.dispatchRequest(), undefined];
            let promise: any = Promise.resolve(requsetConfig);
            this.interceptors.request.forEach((interceptor: any) => {
                chain.unshift(interceptor.fulfilled, interceptor.rejected);
            });
            this.interceptors.response.forEach((interceptor: any) => {
                chain.push(interceptor.fulfilled, interceptor.rejected);
            });
            while (chain.length) {
                promise = promise.then(chain.shift(), chain.shift());
            }
            return promise;
        } catch (err) {
            console.error(TAG, err);
            return Promise.reject(err)
        }
    }

    requestList(len: number) {
        try {
           
            if(this.sendList.length==0) {
                 this.logger('sendList is none');
                 return 
            }
             if(!this.ready) {
                this.logger('sendList is`t ready');
                return 
            }
            let count = 0
            this.logger('start sendList ', 0,len, this.sendList.length);
            while (this.sendList && this.sendList.length) {
                let send = this.sendList.shift()
                if (send) {
                    let { config, resolve, reject } = send

                    this.request(config).then(
                        (res: any) => {
                            resolve(res)
                        },
                        (err: any) => {
                            reject(err)
                        }
                    )
                }

                count = count + 1
                if (len && count >= len) break

            }
        } catch (e) {
            console.error(TAG, e)
           
        }

    }

    _request(requsetConfig: TinyAppHttpRequset) {
        this.logger('not ready push sendlist', 0,requsetConfig.url);
        return new Promise((resolve, reject) => {
            this.sendList.push({ config: requsetConfig, resolve, reject })
        })
    }



    abstract autoAddAuthorization(requsetConfig: TinyAppHttpRequset): void;
}

export default class TinyAppHttp extends TinyAppHttpBase {
    request_token_err = 0
    do_request_token = false
    request_token_time = 0
    systemInfo:any
    _request_err = 0
    token: Token | undefined
    constructor(instanceConfig?: TinyAppHttpConfig | undefined) {
        super(instanceConfig)
        if (this.defaults.autoToken == undefined) {
            this.defaults.autoToken = true
        }
       
               
       if(this.defaults.appId && this.defaults.hostBaseUrl) {
           setTimeout(() => {
            this.start(false)
        }, 100)
       }else {
          this.logger("wait config",0)
       }
    }

    getSystemInfo() {
        if(this.systemInfo){
            Promise.resolve(this.systemInfo)
        }else {
            return getSystemInfoSync()
        }
    }



    config(config: {
        autoLogin?:boolean,
        appId?: string,
        hostBaseUrl?: string
    }) {
        this.defaults = Object.assign(
            this.defaults || {},
            config
        );
        if (this.defaults.hostBaseUrl) this.hostBaseUrl = this.defaults.hostBaseUrl          
        setTimeout(() => {
            this.logger("config() -> start() ",0)
            this.start(config.autoLogin)
         }, 0)
    }


    async _refresh_token() {
        logger('------正在刷新token------');
        try {
            if (this.token && this.token.success) {
                let { refresh_token } = this.token
                let res: any = await _request_(this.defaults, {
                    url: this.hostBaseUrl + '/auth/refresh_token',
                    method: 'POST',
                    data: { refresh_token: refresh_token }
                })
                //{"code":"0","data":{"access_token":"60A7845C11506C457419D0547BA77F44","refresh_token":"87C0532BE47DF258B71EC9925F382487","expires_in":604800,"token_type":"","scope":"","open_user_id":"2088702372862094"},"msg":"","biz_suc":true,"suc":true,"message":""}
                // {"code":"0","data":{"access_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","refresh_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","expires_in":604800,"token_type":"","scope":""},"msg":"","biz_suc":true,"suc":true,"message":""}
                if (res && res.code === '0' && res.data) {
                    logger('------_refresh_token access_token success------');
                    let result = res.data
                    result.timestamp = +Date.now()
                    let expires_in = result.expires_in || 3600
                    result.expireTime = result.timestamp + ((expires_in - 600) * 1000)
                    result.success = true
     
                  //  let globalData = getApp().globalData
                  //  globalData.userId = globalData.alipayId = res.data.open_user_id
                 
                 //   let Tracker = $global.Tracker
                 //   Tracker && Tracker.setUserId(result.open_user_id)
                    updateUserId( res.data.open_user_id)
                    let globalData = getApp().globalData
                    if (globalData) { globalData.set('access_token', result) }
                    else {
                        my.setStorage({ key: 'access_token', data: result })
                    }

                    return result
                } else {
                   
                }
            }

        } catch (e) {
            console.warn(TAG + "_refresh_token error", e)
        }
    }


    async _request_token(): Promise<Token | undefined> {
       
        let t0 = Date.now()
        try {
            if (this.request_token_err >= 10) {
                logger('_request_token 错误次数太多');
                if (Date.now() - this.request_token_time > 60000) {
                    this.request_token_err = 0
                }
                return
            }
            let count = 0
            while (this.do_request_token) {                
                logger('_request_token 正在授权中');
                await sleep(100)
                count++
                if(!this.do_request_token || count>100) {
                     logger('_request_token 授权完成',count);
                    return await loadToken()
                }
            }
            this.request_token_time = +Date.now()

            this.do_request_token = true
            logger('------正在进行授权------');
            let silenceRes: any = await silenceAuthCode();
            const { authCode } = silenceRes;
            logger('------静默授权成功------');
            let res: any = await _request_(this.defaults, {
                url: this.hostBaseUrl + '/uaa/open/alipay_auth_login?authcode=' + authCode,
                method: 'POST',
                data: { authcode: authCode }
            })
            //{"code":"0","data":{"access_token":"60A7845C11506C457419D0547BA77F44","refresh_token":"87C0532BE47DF258B71EC9925F382487","expires_in":604800,"token_type":"","scope":"","open_user_id":"2088702372862094"},"msg":"","biz_suc":true,"suc":true,"message":""}
            // {"code":"0","data":{"access_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","refresh_token":"348CFE2736B6BADBCEE7B4A0FBA0B721","expires_in":604800,"token_type":"","scope":""},"msg":"","biz_suc":true,"suc":true,"message":""}
            if (res && res.code === '0' && res.data) {
                logger('------alipay_auth_login access_token success------');

                let result = res.data
                result.timestamp = +Date.now()
                let expires_in = result.expires_in || 3600
                result.expireTime = result.timestamp + ((expires_in - 600) * 1000)
                result.success = true
             
             
              /*  let globalData = getApp().globalData
                globalData.userId = globalData.alipayId = res.data.open_user_id
                let Tracker = $global.Tracker
                Tracker && Tracker.setUserId(result.open_user_id)*/
                updateUserId( res.data.open_user_id)
                //logger('access_token success',result);
                  let globalData = getApp().globalData
                    if (globalData) { globalData.set('access_token', result) }
                    else {
                        my.setStorage({ key: 'access_token', data: result })
                    }

               /* my.setStorage({
                    key: 'access_token', data: result, success: () => {
                        let t1 = Date.now()
                        logger('------alipay_auth_login access_token setStorage success------', (t1 - t0));
                    }
                })*/



                this.do_request_token = false
                return result
            } else {
                this.request_token_err++              
            }
            this.do_request_token = false
        } catch (e) {
            this.request_token_err++
            this.do_request_token = false
            console.warn(TAG + "_request_token error", e)
        }
    }




    autoAddAuthorization(requsetConfig: TinyAppHttpRequset) {
        this.interceptors.request.use(
            async (request: any) => {
                //this.logger('Authorization', config._request_id);
                try {

                    if ((!this.token) || (!this.token.success)) {
                        let response = await loadToken();
                        this.token = response || {}
                    }
                    if ((!this.token) || (!this.token.success) || (this._request_err > 10)) {
                        this.logger('token flase or not success or _request_err so do _request_token');
                        this._request_err = 0
                        let response = await this._request_token();
                        this.token = response
                    }
                } catch (e) {
                    console.error(TAG, e)
                }
                if (this.do_request_token) {
                    this.logger('RefreashToken', requsetConfig._request_id, "request await");
                    await sleep(3000)
                }
                if (this.token && this.token.success) {
                    this.defaults.access_token = this.token.access_token
                }
                return request;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
        this.interceptors.response.use(
            async (response: any) => {
                if (response) {
                    let {
                        code
                    } = response;
                    try {
                        if (code === '401' || code === '403') {
                            this.logger('RefreashToken', requsetConfig._request_id, response);
                            if (this.do_request_token) {
                                this.logger('RefreashToken', requsetConfig._request_id, "await");
                                await sleep(3000)
                            } else {
                                this.logger('code  401 or 403  so do _request_token L463',0);
                                let res = await this._request_token()
                                this.token = res
                            }
                            if (this.token && this.token.success) {
                                this.defaults.access_token = this.token.access_token
                                this.logger('RefreashToken', requsetConfig._request_id, '_request_ again');
                                let ret = await _request_(this.defaults, requsetConfig);                 
                                this.logger('interceptors.response,_request_ next ', requsetConfig._request_id);               
                                this.requestList( this.sendList.length)
                                return ret;
                            } else {
                                this.logger('RefreashToken', requsetConfig._request_id, '_request_token fail');
                            }
                        }else {
                            this.logger('interceptors.response ok,requestList next ', requsetConfig._request_id);
                            this.requestList( this.sendList.length)
                            return response
                        }
                    } catch (e) {
                        console.warn(TAG + "RefreashToken catch error", e)
                    }
                  
                }
                this.logger('interceptors.response,requestList next ', requsetConfig._request_id);
                this.requestList(1)
                return response
            },
            (error: any) => {
                this._request_err++
                this.requestList(1)
                return Promise.reject(error);
            }
        );
    }





    async start(autoLogin:boolean = true) {
        try {
            if (!this.ready) {
                 console.time("time-start")
                 getSystemInfoSync().then((systemInfo)=>{
                 Object.assign(this.defaults, systemInfo)
                 this.systemInfo = systemInfo
                 })
                //console.time("REQUEST start")             
                //await sleep(10000)
                if ((!this.token) || (!this.token.success)) {
                    let response = await loadToken();
                    this.token = response
                }
                if(autoLogin){
                if ((!this.token) || (!this.token.success)) {
                    this.logger('in funcation start() token false or not success so do _request_token L463', 0);
                    let response = await this._request_token();
                    this.token = response
                }
                }
                let userId = this.token && this.token.open_user_id
                if (userId) {
                    this.logger('start userId', 0, userId);
                  /*  let globalData: any = getApp().globalData                 
                    globalData.userId = globalData.alipayId = userId
                    let Tracker = $global.Tracker
                    Tracker && Tracker.setUserId(userId)*/
                    updateUserId( userId)
                }
                 console.timeEnd("time-start")
                //console.timeEnd("REQUEST start")
            }
        } catch (e) {
            console.error(TAG, e)
        }
        //let res = await this._refresh_token({...this.systemInfo, ...this.defaults})
        this.ready = true
        this.logger('start ready ', 0);
        this.requestList(1)
        return this.ready
    }

    send(requsetConfig: TinyAppHttpRequset) {
         if (requsetConfig.url.indexOf('https:') == -1 && requsetConfig.url.indexOf('http:') == -1)
         {
             return this.ready && (!this.do_request_token) ? this.request(requsetConfig) : this._request(requsetConfig)
         }else { 
             this.logger('start request not need token', 0,requsetConfig.url);            
             return this.request(requsetConfig,false)// not need token
         }
     
    }

    async getUserId():Promise<string | undefined | null> {
        let token = await this.getToken()
        let userId = (token && token.open_user_id) || null
        let globalData: any = getApp().globalData                 
        if(!globalData.userId && userId ){
             updateUserId( userId)
        }
        return userId
    }

    async getToken():Promise<Token | undefined> {
        try {

            //await sleep(10000)
            let count = 0
            while(!this.ready && count++ <100) {
              this.logger('not ready wait sleep 100',count )
              await sleep(100)
            }
            if ((!this.token) || (!this.token.success)) {
                let response = await loadToken();
                this.token = response || {}
            }
          
            if ((!this.token) || (!this.token.success)) {
                this.logger('in funcation getToken() token flase or not success or _request_err so do _request_token', 0, this.token);
                let response = await this._request_token();
                this.token = response
            }

        } catch (e) {
            console.error(TAG, e)
        }
        return this.token
    }




}








//{
// appId:''
// hostBaseUrl:'https://sit-basic-ug.allcitygo.com'
//}
const tinyAppHttp = new TinyAppHttp()

export const http =  tinyAppHttp

export function getUserId() {
  return tinyAppHttp.getUserId()
}

export function getToken() {
  return tinyAppHttp.getToken()
}

export function config(config: {
  appId?: string,
  autoLogin?:boolean,
  env?:string,
  hostBaseUrl?: string
}) {
  config.env && setEnv(config.env);
  tinyAppHttp.config(config)
}


/**
 *
 * @param {接口地址} url
 * @param {接口入参} data
 * @param {mock数据，on 开关， data，mock的数据} mock
 * @param {请求方式，默认get} method
 * @param {业务参数控制} businessConfig
 */
export async function request(
  url: string = '', // 请求地址
  data: any = {}, // 请求参数
  mock: RequsetMock = {
    on: false, // 是否启用mock数据
    data: {} // mock 开启时返回该参数
  },
  method: string | "POST" | "GET" | undefined = 'GET', // 请求方式
  businessConfig: BusinessConfig = {
    headers: {
      'content-type': 'application/json; charset=UTF-8'
    }
  }
):Promise<{
    API_ERROR: boolean,
    code?:string|number,
    msg?:string,
    sub_code?:string|number,
    sub_msg?:string,
    timestamp?:number,
    data?:any
  }> {
  if (mock.on) {
    return new Promise(resolve => {
      if (mock.delay) {
        setTimeout(() => {
          resolve({
            API_ERROR: false,
            ...mock.data});
        }, mock.delay)
      } else {
      setTimeout(() => {
          resolve({
            API_ERROR: false,
            ...mock.data});
        },0)
      }

    });
  }
  let res = null

  url = (businessConfig.urlType && getDomain(businessConfig.urlType) || "") + url;
  try {
    if (method == 'post') {
      method = 'POST'
    }
    else if (method == 'get') {
      method = 'GET'
    }
    res = await tinyAppHttp.send({
      method: <"POST" | "GET" | undefined>method,
      url,
      data,
      businessConfig
    })

    return {
      API_ERROR: false,
      ...res
    }
  } catch (e) {
    console.warn("request catch err L88")
  }


  return res || {
    API_ERROR: true
  };
}

