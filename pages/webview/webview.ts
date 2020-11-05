import store from './store'
//import {  jumpToBusCode } from '../../components/card-component/utils'
import { getUserId, getToken } from '../../utils/TinyAppHttp'
import basepage from '../../utils/basepage';
const createPage = function (options: tinyapp.PageOptions<any>) {
    return Page(store.register(options))
};

function trim(str: string) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
createPage({
    data: {
        url: '' // h5链接
    },
    async onLoad(options: any) {
        // app.Tracker.Page.init(this,options)
        //my.hideBackHome();
        this.webViewContext = my.createWebViewContext('web-view-1');
        let userId = await getUserId()
        if(options){
            let globalData = getApp().globalData           
            let {url,taskType, sellerId,taskId}= options//.replace(/(\s*$)/g,"") //'http://sit-operation.allcitygo.com/TeStabc/test.html'//
            
            if(url){
            if (url.indexOf('{userId}') > -1) {
                url = url.replace('{userId}', userId)
            }
            if (url.indexOf('{sellerId}') > -1) {
                url = url.replace('{sellerId}', sellerId)
            }
            if (url.indexOf('{taskId}') > -1) {
                url = url.replace('{taskId}', taskId)
            }
            if (url.indexOf('{taskType}') > -1) {
                url = url.replace('{taskType}', taskType)
            }
            if (url.indexOf('{appId}') > -1) {
                url = url.replace('{appId}', globalData.appId)
            }
            if (url.indexOf('{cityCode}') > -1) {
                url = url.replace('{cityCode}', globalData.cityInfo.cityCode)
            }
            if (url.indexOf('{cityName}') > -1) {
                url = url.replace('{cityName}', globalData.cityInfo.cityName)
            }
            if (url.indexOf('{formId}') > -1) {
                url = url.replace('{formId}', globalData.formId)
            }

          
            this.setData({
                url: trim(url),
                taskType,
                sellerId,
                taskId
            }, () => {
                console.log('页面地址', this.data.url + "|" + encodeURIComponent(this.data.url))
            })
            }

        }


    },

    onShow() {
        //scene
        let globalData = getApp().globalData;
        this.webViewContext && globalData.scene && this.webViewContext.postMessage({ onShow: { scene: globalData.scene } });
    },

    onShareAppMessage(options) {
        let globalData = getApp().globalData;
        let url = options.webViewUrl || this.data.url
        if (url && url.indexOf(globalData.alipayId)) {
            url = url.replace(globalData.alipayId, "{userId}")
        }
        //my.alert({content:JSON.stringify(url)});
        return {
            title: `分享${globalData.cityInfo.title}`,
            //desc: 'View 组件很通用',
            path: `pages/webview/webview?url=${encodeURIComponent(url)} `,
            'web-view': url,
        };
    },
    events: {
        onBack() {
          
          let {taskType,sellerId,taskId} = this.data
         if(taskType==='shop')  {
             let app:any =  getApp()
             app.taobaoResult({code:"SUCCESS",sellerId,type:taskType,taskId})
          }
            
        },
    },
    ...basepage
});
