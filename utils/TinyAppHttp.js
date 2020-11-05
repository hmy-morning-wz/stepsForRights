import getDomain, { setEnv } from './httpEnv';
const HOST_BASE_URL = 'https://ztmanage.allcitygo.com:8192';
const APP_VERSION = '1.0.0';
const TAG = '[REQUEST]';
const TIMEOUT = 10000;
function logger(tag, ...payload) {
    console.debug(`%c ${TAG}[${tag}]`, 'color: #9E9E9E; font-weight: bold', ...payload);
}
const qs = {
    parse: function (str) {
        if (!str || str.length == 0)
            return {};
        let list = str.split('&');
        if (!list || list.length == 0)
            return {};
        let out = {};
        for (let index = 0; index < list.length; index++) {
            let set = list[index].split('=');
            set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]));
        }
        return out;
    },
    stringify: function (data) {
        if (!data)
            return '';
        let list = [];
        for (let key in data) {
            if (data[key] instanceof Array && data[key].length) {
                data[key].forEach((t) => {
                    list.push(key + '=' + encodeURIComponent(t));
                });
            }
            else {
                list.push(key + '=' + encodeURIComponent(data[key]));
            }
        }
        return list.join('&');
    }
};
function updateUserId(userId) {
    if (userId) {
        let app = getApp();
        app.userId = userId;
        let globalData = app.globalData;
        globalData.userId = globalData.alipayId;
        let Tracker = app.Tracker;
        Tracker && Tracker.setUserId(userId);
    }
}
function _request_(httpConfig, requsetConfig) {
    let { url, method, data, headers, timeout, } = requsetConfig;
    headers = Object.assign(getDefaultHeader(httpConfig), headers);
    if (!headers['content-type'])
        headers['content-type'] = 'application/json';
    if (headers['content-type'] && headers['content-type'].indexOf('application/json') > -1) {
        data = JSON.stringify(data);
    }
    logger('my.request', method, url, headers, data);
    let t0 = +Date.now();
    return new Promise((resolve, reject) => {
        try {
            my.request({
                url,
                method,
                headers,
                data,
                timeout: timeout || TIMEOUT,
                success: res => {
                    let t1 = +Date.now();
                    let spendTime = t1 - t0;
                    logger('my.request spendTime', url, spendTime);
                    resolve(res.data);
                },
                fail: error => {
                    console.warn(TAG + "request fail", url);
                    if (error.status === 401 || error.status === 403) {
                        return resolve({ code: "401" });
                    }
                    reject(error);
                },
                complete: () => {
                }
            });
        }
        catch (e) {
            console.warn(TAG + "request catch error", e);
            reject(e);
        }
    });
}
class InterceptorManager {
    constructor() {
        this.handlers = [];
    }
    use(fulfilled, rejected, autoAddAuth = false) {
        this.handlers.unshift({
            fulfilled: fulfilled,
            rejected: rejected,
            isAutoAuth: autoAddAuth
        });
        return this.handlers.length - 1;
    }
    forEach(fn) {
        const newHandles = [];
        this.handlers.forEach(h => {
            if (h !== null) {
                fn(h);
            }
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
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
function getSystemInfoSync() {
    return new Promise(async (resolve, reject) => {
        let deviceId = "";
        let ret = await getStorageSync({ key: 'devId' });
        if (ret && ret.data) {
            deviceId = ret.data;
        }
        else {
            deviceId = guid();
            let globalData = getApp().globalData;
            if (globalData) {
                globalData.set('devId', deviceId);
            }
            else {
                my.setStorage({ key: 'devId', data: deviceId });
            }
        }
        let systemInfo;
        let loading = (my.$mySystemInfo && my.$mySystemInfo.loading);
        if (loading) {
            let count = 0;
            do {
                await sleep(50);
                if (my.$mySystemInfo && my.$mySystemInfo.success) {
                    systemInfo = my.$mySystemInfo;
                    systemInfo.deviceId = systemInfo.deviceId || deviceId;
                    break;
                }
            } while (count++ < 10);
        }
        else {
            systemInfo = my.$mySystemInfo;
        }
        if (systemInfo && systemInfo.success) {
            console.log("TinyAppHttp getSystemInfoSync from systemInfo");
            systemInfo.deviceId = systemInfo.deviceId || deviceId;
            return resolve(systemInfo);
        }
        my.getSystemInfo({
            success: async (res) => {
                let systemInfo = res;
                systemInfo.deviceId = deviceId;
                resolve(systemInfo);
            },
            fail: () => {
                reject();
            }
        });
    });
}
function sleep(time) {
    logger('sleep', time);
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                logger('sleep timeout');
                resolve();
            }, time || 1000);
        }
        catch (e) {
            reject(e);
        }
    });
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
        var t = 16 * Math.random() | 0, r = 'x' === e ? t : 3 & t | 8;
        return r.toString(16);
    });
}
function makeUrl(url, data) {
    let index = url && url.indexOf('?');
    return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data);
}
function getDefaultHeader(data) {
    let APP_ID = data.appId || getApp().globalData.appId;
    if (!APP_ID) {
        const { appId } = (my.canIUse('getAppIdSync') && my.getAppIdSync()) || {};
        APP_ID = appId;
        console.log("APP_ID", APP_ID);
    }
    let res = {
        'app_id': APP_ID,
        'app_version': data.appVersion || APP_VERSION,
        'device_id': data.deviceId,
        'device_os': data.platform,
        'device_name': data.model,
    };
    if (data.access_token) {
        res.access_token = data.access_token;
        res.Authorization = 'Bearer ' + data.access_token;
    }
    return res;
}
async function getStorageSync(data) {
    let { key } = data;
    console.log("getStorageSync ", key);
    let globalData = getApp().globalData;
    if (globalData) {
        let res = await globalData.get(key);
        return { data: res };
    }
    else
        return new Promise((resolve, reject) => {
            my.getStorage({
                key: key,
                success: (res) => {
                    resolve(res);
                },
                fail: () => {
                    reject();
                }
            });
        });
}
async function loadToken() {
    let res = await getStorageSync({ key: 'access_token' });
    let now = +Date.now();
    if (res && res.data && res.data.expireTime > now) {
        logger('loadToken success', res.data.expireTime);
        return res.data;
    }
    else {
        logger('loadToken none', res);
        return {
            success: false
        };
    }
}
class TinyAppHttpBase {
    constructor(instanceConfig) {
        this.ready = false;
        this._request_id = 0;
        this.defaults = {};
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
        this.sendList = [];
        instanceConfig && (Object.assign(this.defaults, instanceConfig));
        this.hostBaseUrl = instanceConfig && instanceConfig.hostBaseUrl || HOST_BASE_URL;
    }
    logger(tag, _request_id, ...payload) {
        console.debug(`%c${TAG}[%d][${tag}]`, 'color: #9E9E9E; font-weight: bold', _request_id || 0, ...payload);
    }
    autoAddLogger(requsetConfig) {
        this.interceptors.request.use(async (request) => {
            this.logger('interceptors request', requsetConfig._request_id, request);
            return request;
        }, (error) => {
            return Promise.reject(error);
        });
        this.interceptors.response.use(async (response) => {
            this.logger('interceptors response', requsetConfig._request_id, response);
            return response;
        }, (error) => {
            this.logger('interceptors response error', requsetConfig._request_id, error);
            return Promise.reject(error);
        });
    }
    dispatchRequest() {
        return (requsetConfig) => {
            return _request_(this.defaults, requsetConfig);
        };
    }
    request(requsetConfig, needToken = true) {
        try {
            requsetConfig._request_id = this._request_id++;
            requsetConfig.method = requsetConfig.method || 'GET';
            requsetConfig.headers = requsetConfig.businessConfig.headers || {};
            if (requsetConfig.method === 'GET') {
                if (requsetConfig.data && typeof requsetConfig.data === 'object' && Object.keys(requsetConfig.data).length) {
                    requsetConfig.url = makeUrl(requsetConfig.url, requsetConfig.data);
                }
                delete requsetConfig.data;
            }
            else {
                requsetConfig.data = requsetConfig.data || {};
            }
            if (requsetConfig.url.indexOf('https:') == -1 && requsetConfig.url.indexOf('http:') == -1) {
                requsetConfig.url = requsetConfig.url.indexOf('/') == 0 ? this.hostBaseUrl + requsetConfig.url : this.hostBaseUrl + '/' + requsetConfig.url;
            }
            this.autoAddLogger(requsetConfig);
            needToken && this.defaults.autoToken && this.autoAddAuthorization(requsetConfig);
            let chain = [this.dispatchRequest(), undefined];
            let promise = Promise.resolve(requsetConfig);
            this.interceptors.request.forEach((interceptor) => {
                chain.unshift(interceptor.fulfilled, interceptor.rejected);
            });
            this.interceptors.response.forEach((interceptor) => {
                chain.push(interceptor.fulfilled, interceptor.rejected);
            });
            while (chain.length) {
                promise = promise.then(chain.shift(), chain.shift());
            }
            return promise;
        }
        catch (err) {
            console.error(TAG, err);
            return Promise.reject(err);
        }
    }
    requestList(len) {
        try {
            if (this.sendList.length == 0) {
                this.logger('sendList is none');
                return;
            }
            if (!this.ready) {
                this.logger('sendList is`t ready');
                return;
            }
            let count = 0;
            this.logger('start sendList ', 0, len, this.sendList.length);
            while (this.sendList && this.sendList.length) {
                let send = this.sendList.shift();
                if (send) {
                    let { config, resolve, reject } = send;
                    this.request(config).then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
                count = count + 1;
                if (len && count >= len)
                    break;
            }
        }
        catch (e) {
            console.error(TAG, e);
        }
    }
    _request(requsetConfig) {
        this.logger('not ready push sendlist', 0, requsetConfig.url);
        return new Promise((resolve, reject) => {
            this.sendList.push({ config: requsetConfig, resolve, reject });
        });
    }
}
export default class TinyAppHttp extends TinyAppHttpBase {
    constructor(instanceConfig) {
        super(instanceConfig);
        this.request_token_err = 0;
        this.do_request_token = false;
        this.request_token_time = 0;
        this._request_err = 0;
        if (this.defaults.autoToken == undefined) {
            this.defaults.autoToken = true;
        }
        if (this.defaults.appId && this.defaults.hostBaseUrl) {
            setTimeout(() => {
                this.start(false);
            }, 100);
        }
        else {
            this.logger("wait config", 0);
        }
    }
    getSystemInfo() {
        if (this.systemInfo) {
            Promise.resolve(this.systemInfo);
        }
        else {
            return getSystemInfoSync();
        }
    }
    config(config) {
        this.defaults = Object.assign(this.defaults || {}, config);
        if (this.defaults.hostBaseUrl)
            this.hostBaseUrl = this.defaults.hostBaseUrl;
        setTimeout(() => {
            this.logger("config() -> start() ", 0);
            this.start(config.autoLogin);
        }, 0);
    }
    async _refresh_token() {
        logger('------正在刷新token------');
        try {
            if (this.token && this.token.success) {
                let { refresh_token } = this.token;
                let res = await _request_(this.defaults, {
                    url: this.hostBaseUrl + '/auth/refresh_token',
                    method: 'POST',
                    data: { refresh_token: refresh_token }
                });
                if (res && res.code === '0' && res.data) {
                    logger('------_refresh_token access_token success------');
                    let result = res.data;
                    result.timestamp = +Date.now();
                    let expires_in = result.expires_in || 3600;
                    result.expireTime = result.timestamp + ((expires_in - 600) * 1000);
                    result.success = true;
                    updateUserId(res.data.open_user_id);
                    let globalData = getApp().globalData;
                    if (globalData) {
                        globalData.set('access_token', result);
                    }
                    else {
                        my.setStorage({ key: 'access_token', data: result });
                    }
                    return result;
                }
                else {
                }
            }
        }
        catch (e) {
            console.warn(TAG + "_refresh_token error", e);
        }
    }
    async _request_token() {
        let t0 = Date.now();
        try {
            if (this.request_token_err >= 10) {
                logger('_request_token 错误次数太多');
                if (Date.now() - this.request_token_time > 60000) {
                    this.request_token_err = 0;
                }
                return;
            }
            let count = 0;
            while (this.do_request_token) {
                logger('_request_token 正在授权中');
                await sleep(100);
                count++;
                if (!this.do_request_token || count > 100) {
                    logger('_request_token 授权完成', count);
                    return await loadToken();
                }
            }
            this.request_token_time = +Date.now();
            this.do_request_token = true;
            logger('------正在进行授权------');
            let silenceRes = await silenceAuthCode();
            const { authCode } = silenceRes;
            logger('------静默授权成功------');
            let res = await _request_(this.defaults, {
                url: this.hostBaseUrl + '/uaa/open/alipay_auth_login?authcode=' + authCode,
                method: 'POST',
                data: { authcode: authCode }
            });
            if (res && res.code === '0' && res.data) {
                logger('------alipay_auth_login access_token success------');
                let result = res.data;
                result.timestamp = +Date.now();
                let expires_in = result.expires_in || 3600;
                result.expireTime = result.timestamp + ((expires_in - 600) * 1000);
                result.success = true;
                updateUserId(res.data.open_user_id);
                let globalData = getApp().globalData;
                if (globalData) {
                    globalData.set('access_token', result);
                }
                else {
                    my.setStorage({ key: 'access_token', data: result });
                }
                this.do_request_token = false;
                return result;
            }
            else {
                this.request_token_err++;
            }
            this.do_request_token = false;
        }
        catch (e) {
            this.request_token_err++;
            this.do_request_token = false;
            console.warn(TAG + "_request_token error", e);
        }
    }
    autoAddAuthorization(requsetConfig) {
        this.interceptors.request.use(async (request) => {
            try {
                if ((!this.token) || (!this.token.success)) {
                    let response = await loadToken();
                    this.token = response || {};
                }
                if ((!this.token) || (!this.token.success) || (this._request_err > 10)) {
                    this.logger('token flase or not success or _request_err so do _request_token');
                    this._request_err = 0;
                    let response = await this._request_token();
                    this.token = response;
                }
            }
            catch (e) {
                console.error(TAG, e);
            }
            if (this.do_request_token) {
                this.logger('RefreashToken', requsetConfig._request_id, "request await");
                await sleep(3000);
            }
            if (this.token && this.token.success) {
                this.defaults.access_token = this.token.access_token;
            }
            return request;
        }, (error) => {
            return Promise.reject(error);
        });
        this.interceptors.response.use(async (response) => {
            if (response) {
                let { code } = response;
                try {
                    if (code === '401' || code === '403') {
                        this.logger('RefreashToken', requsetConfig._request_id, response);
                        if (this.do_request_token) {
                            this.logger('RefreashToken', requsetConfig._request_id, "await");
                            await sleep(3000);
                        }
                        else {
                            this.logger('code  401 or 403  so do _request_token L463', 0);
                            let res = await this._request_token();
                            this.token = res;
                        }
                        if (this.token && this.token.success) {
                            this.defaults.access_token = this.token.access_token;
                            this.logger('RefreashToken', requsetConfig._request_id, '_request_ again');
                            let ret = await _request_(this.defaults, requsetConfig);
                            this.logger('interceptors.response,_request_ next ', requsetConfig._request_id);
                            this.requestList(this.sendList.length);
                            return ret;
                        }
                        else {
                            this.logger('RefreashToken', requsetConfig._request_id, '_request_token fail');
                        }
                    }
                    else {
                        this.logger('interceptors.response ok,requestList next ', requsetConfig._request_id);
                        this.requestList(this.sendList.length);
                        return response;
                    }
                }
                catch (e) {
                    console.warn(TAG + "RefreashToken catch error", e);
                }
            }
            this.logger('interceptors.response,requestList next ', requsetConfig._request_id);
            this.requestList(1);
            return response;
        }, (error) => {
            this._request_err++;
            this.requestList(1);
            return Promise.reject(error);
        });
    }
    async start(autoLogin = true) {
        try {
            if (!this.ready) {
                console.time("time-start");
                getSystemInfoSync().then((systemInfo) => {
                    Object.assign(this.defaults, systemInfo);
                    this.systemInfo = systemInfo;
                });
                if ((!this.token) || (!this.token.success)) {
                    let response = await loadToken();
                    this.token = response;
                }
                if (autoLogin) {
                    if ((!this.token) || (!this.token.success)) {
                        this.logger('in funcation start() token false or not success so do _request_token L463', 0);
                        let response = await this._request_token();
                        this.token = response;
                    }
                }
                let userId = this.token && this.token.open_user_id;
                if (userId) {
                    this.logger('start userId', 0, userId);
                    updateUserId(userId);
                }
                console.timeEnd("time-start");
            }
        }
        catch (e) {
            console.error(TAG, e);
        }
        this.ready = true;
        this.logger('start ready ', 0);
        this.requestList(1);
        return this.ready;
    }
    send(requsetConfig) {
        if (requsetConfig.url.indexOf('https:') == -1 && requsetConfig.url.indexOf('http:') == -1) {
            return this.ready && (!this.do_request_token) ? this.request(requsetConfig) : this._request(requsetConfig);
        }
        else {
            this.logger('start request not need token', 0, requsetConfig.url);
            return this.request(requsetConfig, false);
        }
    }
    async getUserId() {
        let token = await this.getToken();
        let userId = (token && token.open_user_id) || null;
        let globalData = getApp().globalData;
        if (!globalData.userId && userId) {
            updateUserId(userId);
        }
        return userId;
    }
    async getToken() {
        try {
            let count = 0;
            while (!this.ready && count++ < 100) {
                this.logger('not ready wait sleep 100', count);
                await sleep(100);
            }
            if ((!this.token) || (!this.token.success)) {
                let response = await loadToken();
                this.token = response || {};
            }
            if ((!this.token) || (!this.token.success)) {
                this.logger('in funcation getToken() token flase or not success or _request_err so do _request_token', 0, this.token);
                let response = await this._request_token();
                this.token = response;
            }
        }
        catch (e) {
            console.error(TAG, e);
        }
        return this.token;
    }
}
const tinyAppHttp = new TinyAppHttp();
export const http = tinyAppHttp;
export function getUserId() {
    return tinyAppHttp.getUserId();
}
export function getToken() {
    return tinyAppHttp.getToken();
}
export function config(config) {
    config.env && setEnv(config.env);
    tinyAppHttp.config(config);
}
export async function request(url = '', data = {}, mock = {
    on: false,
    data: {}
}, method = 'GET', businessConfig = {
    headers: {
        'content-type': 'application/json; charset=UTF-8'
    }
}) {
    if (mock.on) {
        return new Promise(resolve => {
            if (mock.delay) {
                setTimeout(() => {
                    resolve(Object.assign({ API_ERROR: false }, mock.data));
                }, mock.delay);
            }
            else {
                setTimeout(() => {
                    resolve(Object.assign({ API_ERROR: false }, mock.data));
                }, 0);
            }
        });
    }
    let res = null;
    url = (businessConfig.urlType && getDomain(businessConfig.urlType) || "") + url;
    try {
        if (method == 'post') {
            method = 'POST';
        }
        else if (method == 'get') {
            method = 'GET';
        }
        res = await tinyAppHttp.send({
            method: method,
            url,
            data,
            businessConfig
        });
        return Object.assign({ API_ERROR: false }, res);
    }
    catch (e) {
        console.warn("request catch err L88");
    }
    return res || {
        API_ERROR: true
    };
}
