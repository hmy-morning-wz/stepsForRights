import { GlobalStore } from 'herculex';
import pageJson from './services/pageJson';
import common from './utils/common';
const timeEn = false;
export default new GlobalStore({
    state: {
        systemInfo: {},
        config: {},
        card: {},
        ele_cards: {},
        cardListStatus: {},
        pageJson: {}
    },
    mutations: {
        UPDATE_SYSTEM: (state, sys) => {
            state.systemInfo = sys;
        },
        SET_CONFIG_JSON: (state, res) => {
            state.config = res;
        },
        SET_CARD_JSON: (state, res) => {
            state.card[res.id] = res;
        },
        SET_PAGE_JSON: (state, payload) => {
            var _a;
            let app = getApp();
            (_a = payload.data) === null || _a === void 0 ? void 0 : _a.forEach((res) => {
                state.pageJson[res.pageUrl] = common.replaceJSON(res.data, app.replaceConfig);
            });
        },
    },
    plugins: ['logger'],
    actions: {
        async updateSystemInfo(d) {
            let { commit } = d;
            console.log('updateSystemInfo->');
            let res = await common.getSystemInfoSync();
            commit('UPDATE_SYSTEM', res);
        },
        async getPageJSON({ commit }, payload) {
            let app = getApp();
            let globalData = app.globalData;
            let appId = app.appId;
            let aliUserId = app.alipayId;
            let arr = [];
            if (Array.isArray(payload)) {
                arr = payload;
            }
            else {
                arr = [payload];
            }
            let result = [];
            for (let i = 0; i < arr.length; i++) {
                let pageUrl = arr[i];
                timeEn && console.time("time-getPageJSON-" + pageUrl);
                console.log('getPageJSON', pageUrl);
                let item = app.extJson.pageJson.filter(common.pageJsonFilter(pageUrl, Object.assign({ userId: aliUserId }, (app.systemInfo || {}))));
                if (item && item.length > 0) {
                    let { locationId, templateId } = item[0];
                    let local = null;
                    let key;
                    try {
                        local = await globalData.get(`PAGE_JSON_${locationId}_${templateId}`);
                        if (app.preview && locationId == app.preview.locationId && templateId == app.preview.templateId) {
                            local = null;
                            key = app.preview.key;
                        }
                        if (local) {
                            result.push({
                                pageUrl,
                                data: local
                            });
                            console.log('getPageJSON use Storage');
                            timeEn && console.timeEnd("time-getPageJSON-" + pageUrl);
                            continue;
                        }
                    }
                    catch (err) {
                        console.warn(err, 'getStorageSync fail');
                    }
                    let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId, key });
                    console.log('getPageJSON queryPageJson await', res);
                    if (res && res.success && res.data) {
                        result.push({
                            pageUrl,
                            data: res.data
                        });
                        globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 });
                    }
                    else if (local) {
                        console.log('getPageJSON queryPageJson fail use local');
                        result.push({
                            pageUrl,
                            data: local
                        });
                    }
                }
                else {
                    console.warn('getPageJSON no config ', pageUrl);
                }
                timeEn && console.timeEnd("time-getPageJSON-" + pageUrl);
            }
            commit('SET_PAGE_JSON', { data: result });
        }
    }
});
