import store from './store'
import {
  request
} from '../..//utils/TinyAppHttp'
const createPage = function (options) {
  return Page(store.register(options))
};
const app = getApp()

createPage({
  data: {
    loadShow: false,
    list: [],
    page: 1,
    pageSize: 10,
  },
  async onLoad(query) {
    // await this.dispatch('getStepsRightsRecordList',query.id)
    this.loadData();
  },
  async loadData(pageNum) {
    const userId = await getApp().loadUserId();
    const params = {
      userId: userId.success,
      page: this.data.page,
      pageSize: this.data.pageSize
    }
    const originData = await request(`/operation-free-bus/stepExchange/exchangeList`, params, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      let list = this.data.list;
      let page = this.data.page + 1;
      list = list.concat(originData.data);// 拼接回来的数据
      this.setData({
        list: list,
        page: page,
      })
      if (list.length >= originData.totalSize) {
        this.setData({
          loadShow: false
        })
      } else {
        this.setData({
          loadShow: true
        })
      }
    }
  },
  handleJump(event) {
    // const id = event.currentTarget.dataset.id
    if (event.currentTarget.dataset.type == 1) {
      my.openVoucherList();
    } else {
      app.handleNavigate(event.currentTarget.dataset.linkUrl)
    }

  },
  onScrollToLower() {
    if (this.data.loadShow) {
      this.setData({
        loadShow: false
      })
      this.loadData();
    }
  },
  onShow() {

  },
  onReady() {
  },

});
