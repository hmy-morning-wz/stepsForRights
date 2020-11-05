declare module "*.json" {
    const value: any;
    export default value;
}


declare type RequsetMock = {
    on:boolean
    data?:any 
    delay?:number | undefined
}


declare type SystemInfo = {
deviceId?:string,
app: string,
brand: string,
currentBattery: string,
fontSizeSetting: number,
language: string,
model:string,
pixelRatio: 2,
platform: string,
storage:string,
system:string,
version:string,
screenWidth: number,
screenHeight: number,
windowWidth: number,
windowHeight: number,
statusBarHeight: number,
titleBarHeight: number
}

declare type TinyAppHttpRequset = {
    url:string
    method:"POST" | "GET" | undefined 
    data?:any | undefined
    headers?:any | undefined
    timeout?:number|undefined,
    _request_id?:number,
    businessConfig?:any | undefined
}
  
declare type Send = {
   config:TinyAppHttpRequset
   resolve:any
   reject:any
}     
    
   
declare type TinyAppHttpConfig = {
    access_token?:string
    appVersion?:string
    deviceId?:string
    platform?:string
    model?:string
    appId?:string
    hostBaseUrl?:string
    autoToken?:boolean | undefined
}
declare type Token = {
    access_token?:string
    expireTime?:number
    expires_in?:number
    open_user_id?:string
    refresh_token?:string
    success:boolean | undefined
    timestamp?:number
}


declare type BusinessConfig = {
headers:any | undefined
urlType?:string | undefined
}

declare type ServiceRequestData = {
  url: string 
  externData?:any
  nextAction?:string | string[]
  cache?:boolean
  retry?:boolean
  type?:string
  data?: any  
  mock?: RequsetMock  
  method?: string | "POST" | "GET" | undefined  
  businessConfig?: BusinessConfig  
}