import '@tklc/miniapp-tracker-sdk'

import { getUserId, config ,request} from './utils/TinyAppHttp'


//@ts-ignore
import herculex from 'herculex'
import serviceplugin from "./utils/serviceplugin"
import servicesCreactor from "./utils/serviceCreator"
import Store from './store'
// @ts-ignore

import appVersion from './version.json'
import GlobalData from './utils/globalData'
import common from './utils/common'
import ext from "./ext.json"
import pageJson from './services/pageJson'
const extJson = ext.ext
/*
if (!my.canIUse('plugin') && !my.isIDE) {
       my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
}*/
// @ts-ignore
//const extJson = my.getExtConfigSync()
const env = extJson.env
//a56.b23056
/*
const Tracert = new tracertTa({
spmAPos: 'a56', // spma位，必填 
spmBPos: 'b23056', // spmb位，必填
system:"a1001",
subsystem:"b1001",
bizType: 'common', // 业务类型，必填
logLevel: 2, // 默认是2
chInfo: '', // 渠道
debug:env=='sit',
mdata: { // 通⽤的数据，可不传，传了所有的埋点均会带该额外参数
 },
})
*/
//setEnv(env)

App(Store({
  // Tracert,
  request,
  herculex,
  serviceplugin,
  servicesCreactor,
  extJson,
  appId:extJson.appId,
  cityCode:{},
  cityAdcode: '',
  globalData: new GlobalData({ 
    env: extJson.env,
    url: extJson.url,
    version: appVersion.version,
    pubkey:"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbio3ym3EF3O9jpdibU5eY7MPkytndz844AU/4OE5ACr4/1oNQWr6Xszvgsj1/Cl5B61gH7RCFj58iq8WonCaBgjdc5zr/a/3Maip29OhoUuELq5tE+d0JhCT4OqzUpm7OGsnDuyj17hpuib+RhDVEFTmCSGHdd1zLi33ON33VsQIDAQAB",
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
    //bizScenario: (query && query.bizScenario) || scene || (referrerInfo && referrerInfo.appId) || "",
    mtrDebug: env=='sit'
  },
  async onLaunch(options: any) {
    const { query, scene, referrerInfo } = options
    let globalData = this.globalData
    let extraBz = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
    let bizScenario = extraBz || (query && query.bizScenario) //|| scene || (referrerInfo && referrerInfo.appId) || ""
    globalData.bizScenario = bizScenario
    globalData.appId = extJson.appId,
    globalData.query = query
    globalData.scene = scene
    globalData.env = extJson.env
    this.replaceConfig = globalData.replaceConfig = { appName: extJson.title, appId: extJson.appId, bizScenario: bizScenario, ...extJson.cityInfo }
    console.info('App onLaunch', options, globalData);
    //getUserId()  
    config({
      env,
      appId: extJson.appId,
      autoLogin: false,
      hostBaseUrl: env === 'sit' ? 'https://sit-basic-ug.allcitygo.com' : 'https://ztmanage.allcitygo.com:8192'
    })
    this.systemInfo = {env:extJson.env  }   
    updateSystemInfo().then((res)=>{
      Object.assign(this.systemInfo,res)  
    }) 
    this.loadUserId()
    my.reportAnalytics("v" + this.mtrConfig.version,
      { version: this.mtrConfig.version });
 
  },
  taobaoResult(param: any) {
    //console.log("taobaoResult", JSON.stringify(param));
    this.globalData.taobaoResult = param
    //https://h5.m.taobao.com/smart-interaction/follow.html?_wvUseWKWebView=YES&type=tb&id=424353450&r=false&img=&back=http%3a%2f%2ftest.tamll.com%3a6501%3ffollowedId%3d92686194&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD

    //&from=follow&tbResult=0 
    let { followedId, from, tbResult } = param
    if (followedId && from && tbResult == 0 && from == 'follow') {
      param = { ...param, code: 'SUCCESS', sellerId: followedId, type: 'follow' }
      this.globalData.taobaoResult = param
    }
    //
    this.$emitter && this.$emitter.emitEvent('taobaoResult', param)
    //my.showToast({ content: JSON.stringify(param) });
    //my.navigateTo({ url: common.makeUrl("/pages/result/result", param) });
  },
  onShow(options: any) {
    const { query, scene, referrerInfo } = options
    let globalData = this.globalData
    let extraBz = referrerInfo && referrerInfo.extraData && referrerInfo.extraData.bizScenario;
    let bizScenario = extraBz || (query && query.bizScenario) //|| scene || (referrerInfo && referrerInfo.appId) || ""
    globalData.bizScenario = bizScenario
    this.type = (query && query.type) || 'normal'
    if (query) {
     /**免费乘车 */ 
      this.msg = query
      this.navigate = options.query
      if (options.referrerInfo && options.referrerInfo.extraData) {
        this.cityCode = (options.referrerInfo && options.referrerInfo.extraData) || ''
        this.cityAdcode = options.referrerInfo.extraData.cityCode
        this.Tracker.setData("cityCode",this.cityAdCode) 
      }
     /**免费乘车 */      
      if (query._preview) {
        let reg = new RegExp('\{.*\}')
        if (reg.test(query._preview)) {
          try {
            let preview = JSON.parse(query._preview)
            if (preview && preview.exp) {
              if (+Date.now() > preview.exp) {
                console.warn("预览码过期")
                preview = null
                my.showToast({ content: "亲，你扫的预览码已过期" })
              }else {
                  let {locationId , templateId,key} = preview
                  pageJson.queryPageJson({appId: this.appId , locationId, templateId,key }).then((res)=>{
                   if (res && res.success && res.data) { 
                       globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 })
                    }
                  })

              }
            }
            this.preview = preview
       
             
          } catch (err) {

          }
          console.log("_preview", query, this.preview)
        }

      }
      if (query.clear) {
        my.clearStorageSync()
        setTimeout(async() => {
          await this.globalData.clear()
          my.clearStorageSync()
          my.confirm({
            title: '缓存清除提示',
            content: '缓存已经清除，是否重启应用？',
            success: function (res) {
              if (res.confirm) {               
                my.clearStorageSync()                
                my.reLaunch({ url: '/pages/index/index' })
              }
            }
          })
        }, 3000);
      }

    }

    globalData.query = query
    globalData.scene = scene
    if (query) {
      let { notifyParam } = query
      if (notifyParam) {
        let result = common.qs.parse(notifyParam)
        this.taobaoResult(result)
      }
    }
  },
     async loadUserId() {      
      if (!this.alipayId) {
        let userId = await getUserId()
        this.alipayId = userId
        this.globalData.userId =userId
        this.replaceConfig.userId = userId
        return { success: userId || false }
      }
      return { success: this.alipayId }
    },
     handleIconClick(e: { currentTarget: { dataset: { obj: any; seedName: any } }; detail: { formId: any } }) {
      console.log('handleClick', e.currentTarget.dataset) 
      if (e.detail && e.detail.formId) {
        console.log("formId", e.detail.formId)
        this.formId =   this.globalData.formId = e.detail.formId
      }
      let obj = e.currentTarget.dataset.obj
      if (!obj) {
        console.warn('handleClick dataset obj is undefine')
        return
      }    
     
      this.handleNavigate(obj)
    },
    
    async handleNavigate(options: any) {
        common.handleNavigate(options, this.globalData);
    }
}))

async function updateSystemInfo() {
  let res = await common.getSystemInfoSync()
  let versionCodes = res.version.split(".").map((t: string) => parseInt(t))
  let version = versionCodes[0] * 10000 + versionCodes[1] * 100 + versionCodes[2]
  if (version < 100170) {//10.1.70
    my.showToast({
      type: 'success',
      content: '您当前支付宝版本过低，须更新'
    })
    //@ts-ignore
    my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()

  } else {
    let sdkVersionCodes = my.SDKVersion.split(".").map((t: string) => parseInt(t))
    let sdkVersion = sdkVersionCodes[0] * 10000 + sdkVersionCodes[1] * 100 + sdkVersionCodes[2] // my.SDKVersion.replace('.', '').replace('.', '')
    if (sdkVersion < 11100) {// 1.11.0
      my.showToast({
        type: 'success',
        content: '您当前支付宝版本过低，须更新'
      })
      //@ts-ignore
      my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()
    }
  }



  try {
    if (my.canIUse('getUpdateManager')) {
      // @ts-ignore
      const updateManager = my.getUpdateManager()
      updateManager.onCheckForUpdate(function (res: { hasUpdate: any }) {

        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        my.confirm({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {

              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {

      })
    }
  } catch (err) {
    console.error(err)
  }
  return res
}

