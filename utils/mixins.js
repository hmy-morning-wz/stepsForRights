// import moment from 'moment'
const fn = function() {};

export default {
  /**
   * 筛选车票
   * @param data
   * @returns Obeject
   */
  processingData(list, type, mode, filters) {
    // 对价格，耗时，出发时间排序
    if (type === 'time') {
      for (let i = 0; i < list.length; i++) {
        const a = list[i].duration.substring(0, 2);
        const b = list[i].duration.substring(3, list[i].duration.length - 1);
        const c = Number(a + b);
        list[i].timeLang = c;
      }
      if (mode === 'bottom') {
        list.sort((a, b) => {
          return b.timeLang - a.timeLang;
        });
      } else {
        list.sort((a, b) => {
          return a.timeLang - b.timeLang;
        });
      }
    } else if (type === 'price') {
      for (let i = 0; i < list.length; i++) {
        if (list[i].price === Infinity) {
          list[i].price = 0;
        }
      }
      if (mode === 'bottom') {
        list.sort((a, b) => {
          return b.price - a.price;
        });
      } else {
        list.sort((a, b) => {
          return a.price - b.price;
        });
      }
    } else if (type === 'goto') {
      for (let i = 0; i < list.length; i++) {
        list[i].gotime = Number(list[i].startTime.replace(':', ''));
      }
      if (mode === 'bottom') {
        list.sort((a, b) => {
          return b.gotime - a.gotime;
        });
      } else {
        list.sort((a, b) => {
          return a.gotime - b.gotime;
        });
      }
    } // 根据浮层的条件进行筛选
    let newArr = [];
    if (JSON.stringify(filters) !== '{}') {
      newArr = list.filter(function(item) {
        let isType = true;
        let isChecked = true;
        let isGo = true;
        let isTo = true;
        let isTime = true;
        if (filters.filterType && filters.filterType.length > 0) {
          if (
            filters.filterType.indexOf('E') !== -1 &&
            ['D', 'G', 'T', 'K', 'C', 'Z'].indexOf(
              item.trainNumber.substring(0, 1)
            ) === -1
          ) {
            isType = true;
          } else {
            isType =
              filters.filterType.indexOf(item.trainNumber.substring(0, 1)) !==
              -1;
          }
        }
        if (filters.filterGo && filters.filterGo.length > 0) {
          isGo = filters.filterGo.indexOf(item.start) !== -1;
        }
        if (filters.filterTo && filters.filterTo.length > 0) {
          isTo = filters.filterTo.indexOf(item.end) !== -1;
        }
        if (filters.checked) {
          if (
            item.tickets.find(a => {
              return a.snum !== '无';
            }) === undefined
          ) {
            isChecked = false;
          }
        }
        if (
          Number(item.startTime.replace(':', '')) <= filters.timeToNum &&
          Number(item.startTime.replace(':', '')) >= filters.timeGoNum
        ) {
          isTime = true;
        } else {
          isTime = false;
        }
        return isType && isChecked && isGo && isTo && isTime;
      });
    }
    // console.log(newArr, list, '新数组--------------');
    return JSON.stringify(filters) === '{}' ? list : newArr;
  },
  /**
   * 重置
   * @param data
   * @returns arr
   */
  resetSelected(list) {
    list.map(item => {
      item.selected = false;
    });
    return list;
  },
  /**
   * 去重拿到车站
   * @param data
   * @returns arr
   */
  getStation(list, type, filterStation) {
    let station = [];
    let typeStation = [];
    for (let i = 0; i < list.length; i++) {
      station.push(list[i][type]);
    }
    // es6数组去重
    let array = Array.from(new Set(station));
    array.map((item, index) => {
      // 处理成组件数组格式
      typeStation.push({ value: item, id: index, fel: '', selected: false });
    });
    // 切换日期的是车站列表刷新，赋值回填筛选框
    if (filterStation.length > 0) {
      for (let i = 0; i < filterStation.length; i++) {
        for (let k = 0; k < typeStation.length; k++) {
          if (typeStation[k].value === filterStation[i]) {
            typeStation[k].selected = true;
          }
        }
      }
    }
    return typeStation;
  },
  /**
   * 获取周几
   * @param data
   * @returns Obeject
   */
  getWeek(data) {
    let weeks = '';
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    if (new Date().getTime() - new Date(data).getTime() > 0) {
      weeks = '今天';
    } else if (new Date().getTime() + 86400000 - new Date(data).getTime() > 0) {
      weeks = '明天';
    } else if (
      new Date().getTime() + 86400000 * 2 - new Date(data).getTime() >
      0
    ) {
      weeks = '后天';
    } else {
      weeks = week[new Date(data).getDay()];
    }
    console.log(weeks, data);
    return weeks;
  },
  /**
   * 时间处理
   * @param data
   * @returns Obeject
   */
  computingTime(atime, ls) {
    let al = Number(atime.substring(0, 2));

    let ar = Number(atime.substring(2, atime.length));
    let ll = Number(ls.substring(0, 2));
    let lr = Number(ls.substring(3, ls.length));
    let bl = 0;
    let br = 0;
    let timeAdd = Math.floor(ll / 24);
    if (ll % 24 < al) {
      if (ar >= lr) {
        bl = al + timeAdd * 24 - ll;
        br = ar - lr;
      }
      if (ar < lr) {
        bl = al + timeAdd * 24 - 1 - ll;
        br = ar + 60 - lr;
      }
    }
    if (ll % 24 > al) {
      if (ar >= lr) {
        bl = al + (timeAdd + 1) * 24 - ll;
        br = ar - lr;
      }
      if (ar < lr) {
        bl = al + (timeAdd + 1) * 24 - 1 - ll;
        br = ar + 60 - lr;
      }
      timeAdd = timeAdd + 1;
    }
    if (ll % 24 === al) {
      if (ar >= lr) {
        bl = al + timeAdd * 24 - ll;
        br = ar - lr;
      }
      if (ar < lr) {
        bl = al + (timeAdd + 1) * 24 - 1 - ll;
        br = ar + 60 - lr;
        timeAdd = timeAdd + 1;
      }
    }
    bl = bl < 10 ? '0' + bl : bl;
    br = br < 10 ? '0' + br : br;
    ll = ll < 10 ? '0' + ll : ll;
    lr = lr < 10 ? '0' + lr : lr;
    al = al < 10 ? '0' + al : al;
    ar = ar < 10 ? '0' + ar : ar;
    const newBtime = bl + ':' + br;
    const newAtime = al + ':' + ar;
    const newls = ll + '时' + lr + '分';
    return { newAtime, newBtime, timeAdd, newls };
  },
  timeDividingLine(time, num) {
    let al = Number(time.substring(0, num));
    let ar = Number(time.substring(num, time.length));
    al = al < 10 ? '0' + al : al;
    ar = ar < 10 ? '0' + ar : ar;
    const newTime = al + ':' + ar;
    return newTime;
  },
  /**
   * 验证身份证合法
   * @param certId String
   * @returns Boolean
   */
  verifiyIdCard(certId) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/gim.test(certId.trim());
  },
  /**
   * 验证手机号码是否合法
   * @param number
   * @returns {boolean}
   */
  verifyTel(number) {
    return /^1[\d]{10}/gim.test(number.trim());
  },
  /**
   * 验证邮箱是否合法
   * @param email
   * @returns {boolean}
   */
  verifyEmail(email) {
    return /^([A-Za-z0-9_\-.])+@[A-Za-z0-9_\-.]+\.[A-Za-z]{2,4}$/gim.test(
      email.trim()
    );
  },
  /**
   * 验证新密码格式是否正确
   * 必须且只能包含大写字母，小写字母，数字，下划线中的两种或两种以上
   * @param pwd
   * @returns {boolean}
   */
  verifyPwd(pwd) {
    return /(?!^\d+$)(?!^[A-Z]+$)(?!^[a-z]+$)(?!^_+$)^\w{6,20}$/gm.test(pwd);
    // return /^[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/gim.test(pwd.trim());
  },
  /**
   * 弹框提示
   * @param moldalType
   * @param params
   * @param callback
   */
  showModal(moldalType = 'alert', params = {}, callback = fn) {
    const {
      title = '提示',
      content = '操作成功',
      buttonText = '确定',
      confirmButtonText = '确定',
      cancelButtonText = '取消',
      duration = 2000,
      type = 'success',
      delay = 0
    } = params;
    switch (moldalType) {
      case 'alert':
        my.alert({ title, content, buttonText, complete: callback });
        break;
      case 'showToast':
        my.showToast({ content, duration, type, complete: callback });
        break;
      case 'hideToast':
        my.hideToast();
        break;
      case 'showLoading':
        my.showLoading({ content, delay });
        break;
      case 'hideLoading':
        my.hideLoading();
        break;
      case 'confirm':
        return new Promise((resolve, reject) => {
          my.confirm({
            title,
            content,
            confirmButtonText,
            cancelButtonText,
            success: result => {
              resolve(result);
            },
            fail: err => {
              reject(err);
            }
          });
        });
      default:
        break;
    }
  },
  methods: {
    /**
     * 创建动画
     * @param animateConfig Object
     */
    createAnimationHandle(animateConfig = {}) {
      return my.createAnimation(
        Object.assign(
          {
            duration: 400,
            timeFunction: 'ease-in-out'
          },
          animateConfig
        )
      );
    }
  }
};
