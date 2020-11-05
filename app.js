import '@tklc/miniapp-tracker-sdk';
import { getUserId, config, request } from './utils/TinyAppHttp';
import herculex from 'herculex';
import serviceplugin from "./utils/serviceplugin";
import servicesCreactor from "./utils/serviceCreator";
import Store from './store';
import appVersion from './version.json';
import GlobalData from './utils/globalData';
import common from './utils/common';
import ext from "./ext.json";
import pageJson from './services/pageJson';
const extJson = ext.ext;
const env = extJson.env;
App(Store({
    request,
    herculex,
    serviceplugin,
    servicesCreactor,
    extJson,
    appId: extJson.appId,
    cityCode: {},
    cityAdcode: '',
    globalData: new GlobalData({
        env: extJson.env,
        url: extJson.url,
        version: appVersion.version,
        pubkey: "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbio3ym3EF3O9jpdibU5eY7MPkytndz844AU/4OE5ACr4/1oNQWr6Xszvgsj1/Cl5B61gH7RCFj58iq8WonCaBgjdc5zr/a/3Maip29OhoUuELq5tE+d0JhCT4OqzUpm7OGsnDuyj17hpuib+RhDVEFTmCSGHdd1zLi33ON33VsQIDAQAB",
    }),
    mtrConfig: {
        server: ['https://webtrack.allcitygo.com:8088/event/upload'],
        version: appVersion.version + '@' + appVersion.date,
        stat_auto_expo: true,
        stat_reach_bottom: true,
        stat_batch_send: true,
        appName: extJson.title,
        appId: extJson.appId,
        stat_app_launch: false,
        stat_app_show: false,
        mtrDebug: env == 'sit'
    },
    async onLaunch(options) {
        const { query, scene, referrerInfo } = options;
        let globalData = this.globalData;
        let extraBz = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
        let bizScenario = extraBz || (query && query.bizScenario);
        globalData.bizScenario = bizScenario;
        globalData.appId = extJson.appId,
            globalData.query = query;
        globalData.scene = scene;
        globalData.env = extJson.env;
        this.replaceConfig = globalData.replaceConfig = Object.assign({ appName: extJson.title, appId: extJson.appId, bizScenario: bizScenario }, extJson.cityInfo);
        console.info('App onLaunch', options, globalData);
        config({
            env,
            appId: extJson.appId,
            autoLogin: false,
            hostBaseUrl: env === 'sit' ? 'https://sit-basic-ug.allcitygo.com' : 'https://ztmanage.allcitygo.com:8192'
        });
        this.systemInfo = { env: extJson.env };
        updateSystemInfo().then((res) => {
            Object.assign(this.systemInfo, res);
        });
        this.loadUserId();
        my.reportAnalytics("v" + this.mtrConfig.version, { version: this.mtrConfig.version });
    },
    taobaoResult(param) {
        this.globalData.taobaoResult = param;
        let { followedId, from, tbResult } = param;
        if (followedId && from && tbResult == 0 && from == 'follow') {
            param = Object.assign(Object.assign({}, param), { code: 'SUCCESS', sellerId: followedId, type: 'follow' });
            this.globalData.taobaoResult = param;
        }
        this.$emitter && this.$emitter.emitEvent('taobaoResult', param);
    },
    onShow(options) {
        const { query, scene, referrerInfo } = options;
        let globalData = this.globalData;
        let extraBz = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
        let bizScenario = extraBz || (query && query.bizScenario);
        globalData.bizScenario = bizScenario;
        this.type = (query && query.type) || 'normal';
        if (query) {
            this.msg = query;
            this.navigate = options.query;
            if (options.referrerInfo && options.referrerInfo.extraData) {
                this.cityCode = (options.referrerInfo && options.referrerInfo.extraData) || '';
                this.cityAdcode = options.referrerInfo.extraData.cityCode;
                this.Tracker.setData("cityCode", this.cityAdCode);
            }
            if (query._preview) {
                let reg = new RegExp('\{.*\}');
                if (reg.test(query._preview)) {
                    try {
                        let preview = JSON.parse(query._preview);
                        if (preview && preview.exp) {
                            if (+Date.now() > preview.exp) {
                                console.warn("预览码过期");
                                preview = null;
                                my.showToast({ content: "亲，你扫的预览码已过期" });
                            }
                            else {
                                let { locationId, templateId, key } = preview;
                                pageJson.queryPageJson({ appId: this.appId, locationId, templateId, key }).then((res) => {
                                    if (res && res.success && res.data) {
                                        globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 });
                                    }
                                });
                            }
                        }
                        this.preview = preview;
                    }
                    catch (err) {
                    }
                    console.log("_preview", query, this.preview);
                }
            }
            if (query.clear) {
                my.clearStorageSync();
                setTimeout(async () => {
                    await this.globalData.clear();
                    my.clearStorageSync();
                    my.confirm({
                        title: '缓存清除提示',
                        content: '缓存已经清除，是否重启应用？',
                        success: function (res) {
                            if (res.confirm) {
                                my.clearStorageSync();
                                my.reLaunch({ url: '/pages/index/index' });
                            }
                        }
                    });
                }, 3000);
            }
        }
        globalData.query = query;
        globalData.scene = scene;
        if (query) {
            let { notifyParam } = query;
            if (notifyParam) {
                let result = common.qs.parse(notifyParam);
                this.taobaoResult(result);
            }
        }
    },
    async loadUserId() {
        if (!this.alipayId) {
            let userId = await getUserId();
            this.alipayId = userId;
            this.globalData.userId = userId;
            this.replaceConfig.userId = userId;
            return { success: userId || false };
        }
        return { success: this.alipayId };
    },
    handleIconClick(e) {
        console.log('handleClick', e.currentTarget.dataset);
        if (e.detail && e.detail.formId) {
            console.log("formId", e.detail.formId);
            this.formId = this.globalData.formId = e.detail.formId;
        }
        let obj = e.currentTarget.dataset.obj;
        if (!obj) {
            console.warn('handleClick dataset obj is undefine');
            return;
        }
        this.handleNavigate(obj);
    },
    async handleNavigate(options) {
        common.handleNavigate(options, this.globalData);
    }
}));
async function updateSystemInfo() {
    let res = await common.getSystemInfoSync();
    let versionCodes = res.version.split(".").map((t) => parseInt(t));
    let version = versionCodes[0] * 10000 + versionCodes[1] * 100 + versionCodes[2];
    if (version < 100170) {
        my.showToast({
            type: 'success',
            content: '您当前支付宝版本过低，须更新'
        });
        my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient();
    }
    else {
        let sdkVersionCodes = my.SDKVersion.split(".").map((t) => parseInt(t));
        let sdkVersion = sdkVersionCodes[0] * 10000 + sdkVersionCodes[1] * 100 + sdkVersionCodes[2];
        if (sdkVersion < 11100) {
            my.showToast({
                type: 'success',
                content: '您当前支付宝版本过低，须更新'
            });
            my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient();
        }
    }
    try {
        if (my.canIUse('getUpdateManager')) {
            const updateManager = my.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                console.log(res.hasUpdate);
            });
            updateManager.onUpdateReady(function () {
                my.confirm({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(function () {
            });
        }
    }
    catch (err) {
        console.error(err);
    }
    return res;
}
