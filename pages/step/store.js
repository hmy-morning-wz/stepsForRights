import Store from 'herculex'
import CONFIG from '../../services/step'
export default new Store({
  connectGlobal: true, // 是否关联global
  state: {
    activity: [],
    banner: [
      {
        image: 'http://img-citytsm.oss-cn-hangzhou.aliyuncs.com/Step/bg.png'
      },
      {
        image: 'http://img-citytsm.oss-cn-hangzhou.aliyuncs.com/Step/bg.png'
      }
    ],
    cityList: [],
    activityIdList: [],
    minStep: '',
    UnauthorizedCopy: '开启健康步数授权',
    pageTitle: '',
    isrepeatClick: true
  },
  mutations: {
    STEPS: (state, config) => {
      state.currentStep = config
    },
    curpage: (state, config) => {
      state.banner = config.banner
      state.UnauthorizedCopy = config.UnauthorizedCopy || '开启健康步数授权'
      if (config.pageTitle) {
        my.setNavigationBar({
          title: config.pageTitle,
        })
      }
    },
    CURRENT_STATE: (state, config) => {
      state.activity = config.stepPrizeStateList;
      state.minStep = config.minStep;
    },
    CLICK_FALSE: (state) => {
      state.isrepeatClick = false;
    },
    CLICK_TRUE: (state) => {
      state.isrepeatClick = true;
    },
    CITY_LIST: (state, config) => {
      config && (state.cityList = config)
    },
    POP_STATE: (state, config) => {
      state.prizeName = config.prizeName
      state.prizeType = config.type || 1
      state.merchantLogo = config.merchantLogo
      state.linkContent = config.content
      state.showPop = true
    },
  },
  actions: {
    clickFalse({ commit }) {
      commit("CLICK_FALSE")
    },
    async pageLoad({ commit, global, dispatch }) {
      await dispatch('$global:getPageJSON', 'pages/step/index');
      await dispatch("pageOnNextLoad")
    },
    async pageOnNextLoad({ state, commit, dispatch, global }, playlod) {
      let curpage = global.getIn(['pageJson', 'pages/step/index'], {})
      commit("curpage", { ...curpage })
    },
    //步数解秘接口
    async getAes({ commit, state }, payload) {
      const userId = await getApp().loadUserId();
      const params = {
        content: payload.content,
        sign: payload.sign,
        userId: userId.success
      }
      const { success, data } = await CONFIG.getAes(params)
      if (success) {
        commit('STEPS', JSON.parse(JSON.stringify(data.count)))
      } else {
        commit('STEPS', '')
      }
    },

    //页面状态
    async getRightsState({ commit, state }, payload) {
      const userId = await getApp().loadUserId();
      const params = {
        userId: userId.success,
        cityCode: getApp().cityAdcode || '330100'
      }
      const { success, data } = await CONFIG.getRightsState(params)
      if (success) {
        commit('CURRENT_STATE', data)
      }
    },
    // 领取权益接口
    async getRights({ commit, state }, payload) {
      const userId = await getApp().loadUserId();
      const params = {
        userId: userId.success,
        prizeId: payload.id,
        steps: payload.step
      }
      const { success, data } = await CONFIG.getStepsRights(params)
      if (success) {
        commit("CLICK_TRUE")
        if (data.type == 2) {
          my.showToast({
            type: 'success',
            content: '兑换成功',
            duration: 1000,
            success: () => {
              getApp().handleNavigate(data.content)
            }
          });
        } else {
          commit("POP_STATE", data)
        }
      } else {
        my.showToast({
          type: 'fail',
          content: '领取失败',
          duration: 1000,
          success: () => {
            commit("CLICK_TRUE")
          },
        });
      }
    },
    //获取城市列表
    async getCityList({ commit, state }) {
      const { success, data } = await CONFIG.getCityList()
      // console.log(data, 'citylist----data')
      if (success) {
        commit('CITY_LIST', data && data.cityList)
      }
    },
  },
})
