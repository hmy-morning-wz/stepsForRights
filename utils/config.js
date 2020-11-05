// 配置文件
const base = {
  lanzhou: {
    appid: '2018121562519951',  
    cardType: 'T0620100',
    cityCode: 620100,
    title: ''
  },
  haikou: {
    appid: '2018120662481627',
    cityCode: 460100,
    cardType: 'T0460100',
    title: '海口公交'
  }
}

const city = 'lanzhou'

export default base[city]

export const appKey = ''

export const alipayAppId = base[city].appid

export const rsaType = 'RSA2'

export const cardType = base[city].cardType
// localstorage
export const sessionIdName = 'tklc'
