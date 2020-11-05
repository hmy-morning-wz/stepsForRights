 // @ts-ignore
import { GlobalStore } from 'herculex'
import { getUserId } from './utils/TinyAppHttp';

import pageJson from './services/pageJson'
import common from './utils/common'
import { pageId } from './constant/index'
const timeEn =false
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


    UPDATE_SYSTEM: (state: { systemInfo: any }, sys: any) => {
      //console.log('设置系统信息', sys)
      state.systemInfo = sys
    },

    SET_CONFIG_JSON: (state: { config: any }, res: any) => {

      state.config = res
    },
    SET_CARD_JSON: (state: { card: { [x: string]: any } }, res: { id: string | number }) => {
      state.card[res.id] = res
    },
   SET_PAGE_JSON: (state: { pageJson: { [x: string]: any } }, payload:any) => {
      let app: any = getApp();
      payload.data?.forEach((res:any) => {
        state.pageJson[res.pageUrl] = common.replaceJSON(res.data, app.replaceConfig)
      });      
    },
  },
  plugins: ['logger'],
  actions: {
    // 获取系统信息
    async updateSystemInfo(d:any) {
      let { commit } = d
      console.log('updateSystemInfo->')
      let res = await common.getSystemInfoSync() // 阻塞式获取系统信息
      
      commit('UPDATE_SYSTEM', res)
    },


    


    async getPageJSON({ commit }: any, payload: string|string[]) {
      let app: any = getApp()
      let globalData = app.globalData
      //await app.loadUserId()
      let appId = app.appId
      let aliUserId = app.alipayId
      let arr:string[]=[]
      if(Array.isArray(payload)) {
          arr = payload
      }else {
          arr = [payload]
      }
      let result:any=[]
      for(let i=0;i<arr.length;i++)
     {     
      let pageUrl = arr[i]
      timeEn && console.time("time-getPageJSON-" + pageUrl)
      console.log('getPageJSON', pageUrl)
   
      let item = app.extJson.pageJson.filter(common.pageJsonFilter(pageUrl,{userId:aliUserId,...(app.systemInfo||{})}))
      /*((t: { pageUrl: any }) => {
        return t.pageUrl === pageUrl
      })*/
      if (item && item.length > 0) {
        let { locationId, templateId } = item[0]
        let local = null
        let key
        try {
          local = await globalData.get(`PAGE_JSON_${locationId}_${templateId}`) //await common.getStorageSync({ key: `PAGE_JSON_${locationId}_${templateId}` })
          //console.log('getPageJSON getStorageSync', ret)
          //local = ret  && ret.data && ret.data.data
          if(app.preview && locationId ==app.preview.locationId  && templateId==app.preview.templateId) {
              local=null      
              key = app.preview.key          
          }
          if (local) {
            result.push( {
              pageUrl,
              data: local
            })
            //commit('SET_PAGE_JSON',)
            /*
            pageJson.queryPageJson({ appId, aliUserId, locationId, templateId }).then((res: { success: any; data: any }) => {
              console.log('getPageJSON queryPageJson then', res)
              if (res && res.success && res.data) {
                commit('SET_PAGE_JSON', {
                  pageUrl,
                  data: res.data
                })
                globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 })            
              }
            })*/
            console.log('getPageJSON use Storage')
            timeEn && console.timeEnd("time-getPageJSON-" + pageUrl)
            continue
          }
        } catch (err) {
          console.warn(err, 'getStorageSync fail')
        }

        let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId,key })
        console.log('getPageJSON queryPageJson await', res)
        if (res && res.success && res.data) {
            result.push( {
              pageUrl,
              data: res.data
            })
         /* commit('SET_PAGE_JSON', {
            pageUrl,
            data: res.data
          })*/
          /*
          my.setStorage({
            key: `PAGE_JSON_${locationId}_${templateId}`,
            data: {
              timestamp: Date.now(),
              data: res.data
            },
            success: (res) => {
              console.log('getPageJSON setStorage success')
            }
          })*/
          globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 })
        } else if (local) {
          console.log('getPageJSON queryPageJson fail use local')
          result.push( {
              pageUrl,
              data: local
            })
          /*commit('SET_PAGE_JSON', {
            pageUrl,
            data: local
          })*/
        }
        //return res
      } else {
        console.warn('getPageJSON no config ', pageUrl)
      }
      timeEn && console.timeEnd("time-getPageJSON-" + pageUrl)
       }
      commit('SET_PAGE_JSON',{data:result})
    }



  }



})
