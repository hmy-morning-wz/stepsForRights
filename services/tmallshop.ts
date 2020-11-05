//alipays://platformapi/startapp?appId=2019041063857386&page=plugin-private%3a%2f%2f2021000196667377%2fpages%2findex%2findex%3fsource%3dLiteStoreAlipayXlight%26sellerId%3d263694008%26extraInfo%3d%257b%2522QDSource%2522%253a%2522AlipayAd%2522%252c%2522Client%2522%253a%2522Alipay%2522%257d%25e2%2580%25a8&query=source%3dAlipayAd%26opType%3dcom.alipay.adexchange.common.trigger%26opParam%3d%257b%2522event%2522%253a%2b%2522conversion%2522%252c%2522contentJson%2522%253a%2b%25221.0%257cJNiq74uMcTUY1FO99CDopGXGfNYf9atnxjB6LIsEr3mIqIUGnFhOsf7xDYoVjFm0RD6I0IynLKpLN9JzpgHRXfPlm19NEZLeJPyqMzdO7x%252f3B1WN573%252bXVSibkN9GzpqfqiO%252fjkD8IgUROfle%252bdHH%252f2KttTiGL6%252b5DMtkUdRZDtzWaBVwz%252f0VTB7L2riWqD5G4qdfpAl4%252bJuGBepuxe4wZLTD8vdBcGZRknTl%252fLsGQTQ2rXvzJfUoW0vLnhFf9IT2T5ttXV9FsWXmGIcEeozmjVYxeeYEHaXdZIHfoReYY8WFjqt4kUMWWvIY94i7FUbRi3kyFvwNCbirSeJT6fLmGUZh%252bVf90nsV8WlNdmuOk859Q16EByBKQ4d%252fGcWruuqWR7E%252b4MFop2%252b1BucVnIdOYINq3gyQYQpDmkutU37pyDsK12h3X3U%2522%257d

//alipays://platformapi/startapp?appId=2019041063857386&page=${encodeURIComponent(plugin-private://2021000196667377/pages/index/index?${encodeURIComponent(source=QDmember&sellerId=${sellerId}&extraInfo=${encodeURIComponent({"QDSource":"AlipayAd","Client":"Alipay"})})})}&query=${encodeURIComponent(source=AlipayAd&behavior=notify&exInfo=${encodeURIComponent($exInfo})}&opType=${opType}&opParam=${encodeURIComponent(${opParam})})}
export default {
   goShopTask({ sellerId, appId, exInfo, opType, opParam, taskUrlType, taskUrl }: {
      sellerId: string, appId: string, exInfo: string,
      opType?: string, opParam?: string, taskUrlType?: string, taskUrl?: string
   }) {
    
      //opType  opParam RPC 接口参数
      //appId ='2019041063857386'
      //exInfo = JSON.stringify({ "autoExit": 1, "notifyParam" : {"userId": "xxx","sellerId":"yyy" } })
      //opParam = JSON.stringify(opParam)
      //  let url = `alipays://platformapi/startapp?appId=${appId}&page=${encodeURIComponent(`plugin-private://2021000196667377/pages/index/index?${(`source=QDmember&sellerId=${sellerId}&extraInfo=${encodeURIComponent(`{"QDSource":"AlipayAd","Client":"Alipay"}`)}`)}`)}&query=${encodeURIComponent(`source=AlipayAd&behavior=notify&exInfo=${encodeURIComponent(`${exInfo}`)}&opType=${opType}&opParam =${encodeURIComponent(`${opParam}`)}`)}`
      if (taskUrlType === 'miniapp') {
         let page = `plugin-private://2021000196667377/pages/index/index?${(`source=QDmember&sellerId=${sellerId}&extraInfo=${encodeURIComponent(`{"QDSource":"AlipayAd","Client":"Alipay"}`)}`)}`
         let query = `source=AlipayAd&behavior=notify&exInfo=${encodeURIComponent(exInfo)}`//&opType=${opType}&opParam=${encodeURIComponent(opParam||"")}`
         let url = `alipays://platformapi/startapp?appId=${appId}&page=${encodeURIComponent(page)}&query=${encodeURIComponent(query)}`;
         // let url = `alipays://platformapi/startapp?appId=${appId}&page=${encodeURIComponent(`plugin-private://2021000196667377/pages/index/index?${(`source=QDmember&sellerId=${sellerId}&extraInfo=${encodeURIComponent(`{"QDSource":"AlipayAd","Client":"Alipay"}`)}`)}`)}&query=${encodeURIComponent(`source=AlipayAd&behavior=notify&exInfo=${encodeURIComponent(`${exInfo}`)}`)}`
         // debugger
         console.log(page, query, url)

         return {
            startApp: true,
            appId,
            param:{
              page,
              query,
            },
            url,
          
         }
      } else if (taskUrlType === 'h5out') {
         return {
            startApp: true,
            appId:"20000067",
            url: taskUrl,
            param:{
              url:taskUrl,
            
            },
         }
      } else {
         return {
            startApp: false,
            url: taskUrl
         }
      }
   },
   /*
   rpc({ type, data }: { type: string, data: any }) {
      my.call('rpc', {
         operationType: type,
         requestData: Array.isArray(data) ? data : [data],
         success: (result: any) => {
            console.log('接⼝请求结果： ', type, result, new Date().getTime());
         },
         fail: (result: any) => {
            console.log(type, result);
         }

      })
      return {
         url: 'rpc'
      }
   }*/
}