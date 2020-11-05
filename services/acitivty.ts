

const mockData: any = {
   task: {},
   cellSteps: 0,//Math.trunc((Math.random() * 10)),
   remainingSteps: 1//+ Math.trunc((Math.random() * 10))
}
const MOCK = false
export default {
   //【入会任务】查询任务是否完成过  /preheatRedBag/taskState
   getTaskState({userTaskList}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatRedBag/taskState',
         method: "POST",
         nextAction: "updateTaskList",
         retry: true,
         data: {
            userId,
            userTaskList
         },    
         businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         },   
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data:                  
                  MOCK && userTaskList.map((t:any)=>{                       
                       return {sellerId:t,state:mockData.task[t] }})
                  /* [{
                     taskId:"1",
                     state:1 //0:未做过；1：做过
                  },{
                     taskId:"2",
                     state:0 //0:未做过；1：做过
                  },{
                     taskId:"3",
                     state:1 //0:未做过；1：做过
                  },{
                     taskId:"4",
                     state:1 //0:未做过；1：做过
                  },{
                     taskId:"5",
                     state:1 //0:未做过；1：做过
                  }]*/
               
            }
         }
      }
   },
   // 【到店任务】查询是否完成到店任务 /preheatStore/storeTaskState
 getStoreTaskState({storeTaskList}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatStore/storeTaskState',
         method: "POST",
         nextAction: "actionGetStoreTaskState",
         retry: true,
         data: {
            userId,
            storeTaskList
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data:[{
                     sellerId:1,
                     state:1 //0:未做过；1：做过
                  }]
            }
         }
      }
   },


   //用户分享记录查询 /double11share/getShareRecordList
   getShareRecordList(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11share/getShareRecordList',
         method: "POST",
         nextAction: "actionGetShareRecordList",
         retry: true,
         data: {
            userId
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {
                  amountMoney: 100, 
                  list: [{
                     id: 1, userId: 0, sharedUserId: "2088", shareMoney: 9.99, state: 1,//状态 0.待 1.显示金额	
                     gmtCreate: '20200901',
                     gmtModified: '20200901',
                  }]
               }
            }
         }
      }
   },
   //【红包】展示  /preheatRedBag/show
   preheatRedBagShow(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatRedBag/show',
         method: "GET",
          nextAction: "actionPreheatRedBagShow",
         retry: true,
         data: {
            userId,
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {
                  userId: "",sumAmount:"10",count:10, amount: 0.00, sellerId: "22222", redBagId: "33333", state: mockData.state||0 //必须 0:金额为0，显示拆；1：不为0，返回金额红包id等
               }
            }
         }
      }
   },

   //【红包】红包翻倍按钮  /preheatRedBag/double
   preheatRedBagDouble({sellerId,sharerId,redBagId,userTaskNumber}: any, { userId }: any): ServiceRequestData {
      if(MOCK) {
          mockData.task[sellerId] = 1
           mockData.state=1
          console.log("MOCK",mockData)
      }
      return {
         url: '/preheatRedBag/double',
         method: "POST",
          nextAction: ["actionPreheatRedBagDouble","getTaskState","$service:preheatRedBagShow"],
         retry: true,
         data: {
            userId, 
            sellerId,
            sharerId,
            redBagId,
            userTaskNumber
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {amount:10,count:userTaskNumber/2,progressBar:userTaskNumber}
            }
         }
      }
   },

   //【红包】红包翻倍按钮  /preheatRedBag/double
   pereheatRedBagPopup({taskNumber}: any, { userId }: any): ServiceRequestData {
      if(MOCK) {
        
      }
      return {
         url: '/preheatRedBag/popup',
         method: "GET",
         nextAction: ["actionPereheatRedBagPopup"],
         retry: true,
         data: {
            userId,           
            taskNumber
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {doubleAmount:10,count:~~taskNumber/2,progressBar:taskNumber}
            }
         }
      }
   },

   //【红包】红包不翻倍（领取奖励）  /preheatRedBag/send
   preheatRedBagSend({redBagId}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatRedBag/send',
         method: "POST",
           nextAction: ["actionPreheatRedBagSend","$service:preheatRedBagShow"],
         retry: true,
         data: {
            userId,    
            redBagId  
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {amount:10}
            }
         }
      }
   },
   //【数据上限控制】双十一预热入会数据控制  /double11data/getInitiationLimitList
   getInitiationLimitList(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11data/getInitiationLimitList',
         method: "GET",
          nextAction: "updateTaskList",
         retry: true,
         data: {
           
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: [{taskId:"1"}]
            }
         }
      }
   },
   //【数据上限控制】双十一预热浏览到店数据控制  /double11data/getStoreLimitList
   getStoreLimitList(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11data/getStoreLimitList',
         method: "GET",
           nextAction: "actionGetStoreLimitList",
         retry: true,
         data: {
           
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: []
            }
         }
      }
   },
   //【到店红包】  /preheatStore/random
   preheatRedBagRandom({sellerId}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatStore/storeRedBag',
         method: "POST",
           nextAction: "actionPreheatRedBagRandom",
         retry: true,
         data: {
           userId,
           sellerId
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {amount:100.00}
            }
         }
      }
   },
   //【中奖记录】用户中奖记录列表  /winningRecord/list
   preheatRedBagList(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/winningRecord/list',
         method: "GET",
           nextAction: "actionPreheatRedBagList",
         retry: true,
         data: {
            userId,
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK ,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: [{prizeName:"奖品名",receiveTime:"20200901"}]
            }
         }
      }
   },
   //【实物抽奖区】获取实物奖品信息 /http://sit-operation.allcitygo.com:80/operation-activity/double11Game/getEntityPrizeList
   getEntityPrizeList({activityId}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11Game/getEntityPrizeList',
         method: "POST",
          nextAction: "actionGetEntityPrizeList",
         retry: true,
         data: {
            userId,
            activityId
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: [{prizeId:"1",status:1//奖品状态（1：未达标；1：未抽；2：已抽）
            }
            ,{prizeId:"2",status:2 }
            ,{prizeId:"3",status:3 }
            ,{prizeId:"4",status:0 }
            ,{prizeId:"5",status:1 }
            ,{prizeId:"6",status:2 }
         ]
            }
         }
      }
   },
   //【实物抽奖区】获取实物奖品（抽奖） /http://sit-operation.allcitygo.com:80/operation-activity/double11Game/getEntityPrize
   getEntityPrize({activityId,prizeId	}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11Game/getEntityPrize',
         method: "POST",
          nextAction: ["actionGetEntityPrize","getEntityPrizeList"],
         retry: true,
         data: {
            userId,
            prizeId,
            activityId
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {
                  prizeId,name:"实物奖品",
                  picture:'https://images.allcitygo.com/image/double202011/pic_hongbao.png?x-oss-process=image/format,webp',winStatus:'1',gameRecordId:'123456',
                  sendLastVoucherList:[{prizeName:"",prizeAmount:"",url:""}]//兜底券
               }
            }
         }
      }
   },
   //【实物抽奖区】记录实物奖品的收货地址 /http://sit-operation.allcitygo.com:80/operation-activity/double11Game/addPrizeAddress
   addPrizeAddress({gameRecordId,address,country,prov,city,area,street,fullname,mobilePhone}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11Game/addPrizeAddress',
         method: "POST",
          nextAction: "actionAddPrizeAddress",
         retry: true,
         data: {
            userId,
            gameRecordId,address,country,prov,city,area,street,fullname,mobilePhone
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {}
            }
         }
      }
   },
///http://sit-operation.allcitygo.com:80/operation-activity/double11Game/getIndustryVoucher 气泡任务
 getIndustryVoucher({campId,activityId}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/double11Game/getIndustryVoucher',
         method: "POST",
          nextAction: "actionGetIndustryVoucher",
         retry: true,
         data: {
            userId,
            campId,activityId
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {prizeName:"0.5元乘车券",prizeAmount:""}
            }
         }
      }
   },
   //兜底券，没任务了调用
 sendVoucher(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatRedBag/sendVoucher',
         method: "GET",
          nextAction: "actionSendVoucher",
         retry: true,
         data: {
            userId,           
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {list:[{prizeName:"0.5元乘车券",prizeAmount:""}]}
            }
         }
      }
   },
   // /sendRedBag
    sendRedBag({sellerId,limitCount,switchFlag,redBagId}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/preheatRedBag/sendRedBag',
         method: "POST",
         nextAction: ["actionSendRedBag","$service:preheatRedBagShow","getTaskState"],
         retry: true,
         data: {
            userId,     
            sellerId,
            limitCount,
            switchFlag,
            redBagId      
         },
           businessConfig:{
            urlType: 'activity',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {list:[{prizeName:"0.5元乘车券",prizeAmount:""}]}
            }
         }
      }
   },
   //https://ztmanage.allcitygo.com:8192/openapi/user/babycare/userid/qz/check?userId=2088512867902161
   //{"errMsg":null,"requestId":"10f2f201-9aac-4be4-8f9a-a86044feca81","errCode":null,"version":"1.0","data":[{"flag":0}]}
     babycareCheck(_: any, { userId }: any): ServiceRequestData {
      return {
         url: '/openapi/user/babycare/userid/qz/check',
         method: "GET",
         nextAction: ["actionBabycareCheck"],
         retry: true,
         data: {
            userId
         },
           businessConfig:{
            urlType: '',
            headers: {
            'content-type': 'application/json'
           }
         }, 
         mock: {
            on: MOCK,
            delay: 2000,
            data: {
               code: 20000,
               msg: "Success",
               data: {}
            }
         }
      }
   },
}