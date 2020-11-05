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
    isReceive: false,
    currentStep: 0,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null,
    authorization: false,
    toast: false,
    arrIndex: '',
    cityCode: '',
    showPop: false,
    prizeName: '',
    prizeType: 1,
    merchantLogo: '',
    linkContent: ''
  },
  handleRecord() {
    my.navigateTo({
      url: `../recordList/index`
    })
  },
  handleZfbBag() {
    my.openVoucherList();
  },
  onModalClose() {
    this.setData({
      showPop: false,
    });
  },
  goByBus() {
    my.ap.navigateToAlipayPage({
      path: 'alipays://platformapi/startapp?appId=200011235&source=applet'
    })
  },
  handleJump() {
    app.handleNavigate(this.data.linkContent)
  },
  handleBannerJump(event) {
    app.handleNavigate(event.currentTarget.dataset.link)
  },
  async bindObjPickerChange(e) {
    this.setData({
      arrIndex: e.detail.value,
    });
    this.state.cityList.forEach((item, index) => {
      if (e.detail.value == index) {
        app.cityAdcode = item.cityCode;
        app.Tracker.setData("cityCode", item.cityCode)
      }
    })
    console.log(app.cityAdcode)
    await this.dispatch('getRightsState')
    this.getStep()
  },
  handleAuthorization() {
    this.getStep();
  },
  handleClsoe() {
    this.setData({
      toast: false,
    })
  },
  async handleCode(event) {
    if (event.currentTarget.dataset.step > this.data.currentStep) {
      my.showToast({
        type: 'none',
        content: '今日步数未达标',
        duration: 3000,
      });
      return
    }
    if (this.state.isrepeatClick) {
      this.dispatch("clickFalse")
      const obj = {
        id: event.currentTarget.dataset.id,
        step: event.currentTarget.dataset.step
      }
      await this.dispatch("getRights", obj)
      await this.dispatch('getRightsState')
      this.getStep()
    }
  },
  //日期处理
  formatDate(date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
  },
  // 获取步数
  async getStep() {
    const date = new Date();
    const dateStr = this.formatDate(date);
    my.getRunData({
      countDate: dateStr,
      timeZone: 'Asia/Shanghai',
      fail: (res) => {
      },
      success: async (res) => {
        console.log(res, '运动步数')
        const userId = await getApp().loadUserId();
        let that = this;
        that.setData({
          authorization: true,
        })
        const data = {
          content: res.response,
          sign: res.sign,
          userId: userId.success
        }
        const originData = await request(`/operation-free-bus/stepExchange/getUserSteps`, data, {
          on: false,
        }, 'post', {
          urlType: 'default',
          headers: {
            'content-type': 'application/json'
          }
        })
        // 数据处理
        if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
          that.setData({
            currentStep: originData.data.steps,
          })
          let step = 0
          if (Number(originData.data.steps) > Number(that.state.minStep)) {
            step = 2
          } else {
            step = ((Number(originData.data.steps) / Number(that.state.minStep)).toFixed(2)) * 2
          }
          that.setData({
            countTimer: null,
            count: 0,
          })
          if (!that.state.minStep) {
            if (that.state.activity.length > 0) {
              step = 2
            } else {
              step = 0
            }
          }
          that.countInterval(10, step)
          if (originData.data.steps == 0) this.setData({
            toast: true,
          })
        }
      },
      complete: (res) => {
        const that = this;
        that.setData({
          authorization: false,
        })
      }
    })
  },
  // 画外层圈
  drawProgressbg: function (step) {
    var context = my.createCanvasContext('canvasProgressbg', this);
    // 设置渐变
    var gradient = context.createLinearGradient(101, 202, 101, 0);
    gradient.addColorStop("0", "#FFFFFF");
    gradient.addColorStop("1.0", "rgba(233,246,255,0.3)");
    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(101, 101, 91, 0, Math.PI * 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function (time, step) {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count <= time) {
        /* 绘制彩色圆环进度条  
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (time / step))
        this.data.count++;
      } else {
        clearInterval(this.countTimer);
      }
    }, 50)
  },
  // 画进度条
  drawCircle: function (step) {
    var context = my.createCanvasContext('canvasProgress', this);
    // 设置渐变
    var gradient = context.createLinearGradient(101, 202, 101, 0);
    gradient.addColorStop("0", "#FF6500");
    gradient.addColorStop("1.0", "#FFAC00");
    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(101, 101, 91, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  async onLoad() {
    await this.dispatch("getCityList")
    let that = this
    my.getLocation({
      type: 1,
      success(res) {
        app.cityAdcode = res.cityAdcode
        app.Tracker.setData("cityCode", res.cityAdcode)
        that.state.cityList.forEach((item, index) => {
          if (item.cityCode == res.cityAdcode) {
            that.setData({
              arrIndex: index,
            });
          }
        })
      },
      fail() {
        // my.alert({ title: '定位失败' });
      },
      async complete() {
        if (!app.cityAdcode) {
          that.state.cityList.forEach((item, index) => {
            if (item.cityCode == '330100') {
              that.setData({
                arrIndex: index,
              });
            }
          })
          app.cityAdcode = '330100'
          app.Tracker.setData("cityCode", '330100')
        }
        that.dispatch('getRightsState')
        await that.getStep()
      }
    })

  },
  async onShow() {
    this.setData({
      showPop: false,
    });
  },
  onReady() {
    this.dispatch('pageLoad')
    this.drawProgressbg()
  },

});
