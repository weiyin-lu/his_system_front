import { createStore } from 'vuex'

export default createStore({
  state: {
    presentPatient:{}
  },
  getters: {
  },
  mutations: {
    persentPatient(state,payload) {
      state.presentPatient = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
