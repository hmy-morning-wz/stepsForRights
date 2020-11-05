
var env:string|undefined = undefined
const prdDomain:{[k:string]:string} = {
  "default":"", 
  "push":"https://operation.allcitygo.com",
  "activity":"",
   "voucher":"",
  "operation":'https://operation.allcitygo.com',
  "preview":"https://operation.allcitygo.com"
}
const sitDomain:{[k:string]:string} = {
  "default":"",
  "activity":'',
  "voucher":"",
  "push":'https://sit-operation.allcitygo.com',
  "operation":'https://sit-operation.allcitygo.com',
  "preview":"https://sit-operation.allcitygo.com"
}

const prdPrefix:{[k:string]:string} = {
 "default":"",
  "voucher":"/voucher",
 "activity":"/operation-activity",
  "preview":"/operation-activity",
 "push":"/operation-push"
}
const sitPrefix:{[k:string]:string} = {
 "default":"",
 "voucher":"/voucher",
 "activity":"/operation-activity",
 "preview":"/operation-activity",
 "push":"/operation-push"
}

export function setEnv(newEnv:any):void {
    newEnv && (env = newEnv)
}

export default function getDomain(urlType:string|undefined):string {
    if(env=='sit')   {
        return (sitDomain[urlType||'default'] || '')+ (sitPrefix[urlType||'default'] || "")
    }
    else {
        return (prdDomain[urlType||'default']||'' )+ (prdPrefix[urlType||'default'] || "")
    }
}
