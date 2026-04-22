import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    username: localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || 'user',
    phone: localStorage.getItem('profile_phone') || '',
    idCard: localStorage.getItem('profile_idCard') || ''
  },
  mutations: {
    SET_AUTH(state, { token, userId, username, role }) {
      state.token = token || ''
      state.userId = userId != null ? String(userId) : ''
      state.username = username || ''
      state.role = role || 'user'
    },
    SET_PROFILE(state, { phone, idCard }) {
      if (phone !== undefined) state.phone = phone || ''
      if (idCard !== undefined) state.idCard = idCard || ''
    },
    CLEAR_USER(state) {
      state.token = ''
      state.userId = ''
      state.username = ''
      state.role = 'user'
      state.phone = ''
      state.idCard = ''
    }
  },
  actions: {
    syncAuthFromStorage({ commit }) {
      commit('SET_AUTH', {
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      })
      commit('SET_PROFILE', {
        phone: localStorage.getItem('profile_phone'),
        idCard: localStorage.getItem('profile_idCard')
      })
    },
    loginSuccess({ commit }, payload) {
      commit('SET_AUTH', payload)
    },
    logout({ commit }) {
      commit('CLEAR_USER')
    }
  }
})
