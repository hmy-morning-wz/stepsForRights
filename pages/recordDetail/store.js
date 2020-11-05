import Store from 'herculex'
import CONFIG from '../../services/step'
export default new Store({
  connectGlobal: true, // 是否关联global
  state: {
    code: '',
  },
  mutations: {
    CODE_DATA: (state, config) => {
      state.code = config.code;
    },
  },
  actions: {
    async queryUserVoucherInfo({ commit, state }, payload) {
      const params = {
        voucherId: payload
      }
      const { success, data } = await CONFIG.queryUserVoucherInfo(params)
      if (success) {
        commit('CODE_DATA', JSON.parse(JSON.stringify(data)))
      } else {
        commit('CODE_DATA', [])
      }
    },
  },
})
