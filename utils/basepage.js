import { getToken } from '../utils/TinyAppHttp';
import common from '../utils/common';
export default {
    goLive(sellerId) {
        my.navigateToMiniProgram({
            appId: '2019091867543618',
            path: 'pages/live-room/live-room?userId=' + sellerId,
            extraData: {},
            success: (res) => {
                console.log(JSON.stringify(res));
            },
            fail: (res) => {
                console.log(JSON.stringify(res));
            }
        });
    },
    taobaoResult(param) {
        var _a;
        console.log("taobaoResult", JSON.stringify(param));
        let app = getApp();
        if (app.taobaoResult) {
            app.taobaoResult(param);
        }
        else {
            my.showToast({ content: JSON.stringify(param) });
        }
        if (((_a = getCurrentPages().pop()) === null || _a === void 0 ? void 0 : _a.route) != "pages/index/index") {
            my.navigateBack();
        }
        else {
            console.log("index");
        }
    },
    async onMessage(e) {
        console.log("onMessage", e);
        let msg = e.detail;
        let param = {};
        let ret;
        if (msg && msg.method)
            switch (msg.method) {
                case 'openCardDetail':
                    my.openCardDetail(msg.param);
                    ret = true;
                    break;
                case 'openCardList':
                    my.openCardList();
                    ret = true;
                    break;
                case 'openKBVoucherDetail':
                    my.openKBVoucherDetail(msg.param);
                    ret = true;
                    break;
                case 'openMerchantCardList':
                    my.openMerchantCardList(msg.param);
                    ret = true;
                    break;
                case 'openMerchantVoucherList':
                    my.openMerchantVoucherList(msg.param);
                    ret = true;
                    break;
                case 'openTicketDetail':
                    my.openTicketDetail(msg.param);
                    ret = true;
                    break;
                case 'openTicketList':
                    my.openTicketList();
                    ret = true;
                    break;
                case 'openMerchantTicketList':
                    my.openMerchantTicketList(msg.param);
                    ret = true;
                    break;
                case 'openVoucherDetail':
                    my.openVoucherDetail(msg.param);
                    ret = true;
                    break;
                case 'openVoucherList':
                    my.openVoucherList();
                    ret = true;
                    break;
                case 'reportAnalytics':
                    msg.param && msg.param.seed && my.reportAnalytics(msg.param.seed, msg.param.data || {});
                    ret = true;
                    break;
                case 'jumpToPage':
                    msg.param && common.handleNavigate(msg.param);
                    ret = true;
                    break;
                case 'makePhoneCall':
                    msg.param && my.makePhoneCall({ number: '' + msg.param.number });
                    ret = true;
                    break;
                case 'getUserInfo':
                    {
                        let token = await getToken();
                        let globleData = getApp().globalData;
                        param = {
                            userId: globleData.alipayId,
                            appId: globleData.appId,
                            cityCode: globleData.cityInfo.cityCode,
                            cityName: globleData.cityInfo.cityName,
                            token: token,
                            formId: globleData.formId
                        };
                        ret = true;
                    }
                    break;
                case 'showSharePanel':
                    my.showSharePanel();
                    ret = true;
                    break;
                case 'hideShareMenu':
                    my.hideShareMenu();
                    ret = true;
                    break;
                case 'goTaobaoLive':
                    this.goLive(msg.param.sellerId);
                    ret = true;
                    break;
                case 'taobaoResult':
                    this.taobaoResult(msg.param);
                    ret = true;
                    break;
                default:
                    ret = false;
                    break;
            }
        let webViewContext = this.webViewContext;
        webViewContext && webViewContext.postMessage({ 'success': ret, method: msg.method, data: param });
    }
};
