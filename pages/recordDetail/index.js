import store from './store'
import parse from 'mini-html-parser2';
const QRCode = require('qrcode');
const createPage = function (options) {
  return Page(store.register(options))
};
const app = getApp()

createPage({
  data: {
    imgSrc: '',
  },
  async onLoad(query) {
    const rule = my.getStorageSync({ key: 'stepActivityRule' }).data.rule
    parse(rule, (err, nodes) => {
      if (!err) {
        this.setData({ rule: nodes })
      }
    })
    await this.dispatch("queryUserVoucherInfo", query.id)
    let self = this;
    QRCode.toString(`${this.state.code}`, { type: 'svg' }, function (err, url) {
      let str = 'data:image/svg+xml;base64,' + Buffer(url).toString('base64');
      self.setData({
        imgSrc: str
      })
    });
  },
  handleSave() {
    const str =  encodeURIComponent(this.state.code)
    my.saveImage({
      url: `https://operation.allcitygo.com/operation-mall/h5SaleProduct/savePicture?width=210&height=210&content=${str}`,
      showActionSheet: false,
      success: (res) => {
          my.showToast({
          content: '保存成功',
        });
      },
    })
  },
  onShow() {

  },
  onReady() {

  },

});
