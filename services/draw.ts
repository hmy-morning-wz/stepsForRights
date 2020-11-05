const mockData: any = {

}
const MOCK = false
export default {
  
   draw({userTaskList}: any, { userId }: any): ServiceRequestData {
      return {
         url: '/voucherOp/sendDouble11Voucher',
         method: "POST",
         nextAction: "drawResult",
         retry: true,
         data: {
            userId,
            userTaskList
         },    
         businessConfig:{
            urlType: 'voucher',
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
                  MOCK && {voucherInfoList:[{voucherName:"优惠券"}]}
               
            }
         }
      }
   }
  }