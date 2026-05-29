import Controller from 'react-imvc/controller'
import * as Model from './Model'
import View from './View'
import { fetchProfile, updateProfile } from '../api/userProfile'
import { buildPath } from '../util/url'

export default class ProfileController extends Controller {
  View = View
  Model = Model

  getInitialState(state) {
    return {
      ...state,
      username:
        (typeof localStorage !== 'undefined' && localStorage.getItem('username')) || '',
    }
  }

  goHome() {
    this.history.push(buildPath('/home', {}))
  }

  async load() {
    this.store.actions.MERGE({ loading: true, toast: '' })
    try {
      const res = await fetchProfile()
      const data = res.data || {}
      this.store.actions.MERGE({
        phone: data.phone || '',
        idCard: data.idCard || '',
        username: data.username || this.store.getState().username,
      })
    } catch (e) {
      this.store.actions.MERGE({ toast: e.message || '加载失败' })
    } finally {
      this.store.actions.MERGE({ loading: false })
    }
  }

  async save() {
    const s = this.store.getState()
    const phone = (s.phone || '').trim()
    const idCard = (s.idCard || '').trim()
    if (phone && !/^1\d{10}$/.test(phone)) {
      this.store.actions.MERGE({ toast: '手机号格式不正确' })
      return
    }
    this.store.actions.MERGE({ saving: true, toast: '' })
    try {
      await updateProfile({ phone, idCard })
      this.store.actions.MERGE({ phone, idCard, toast: '已保存' })
    } catch (e) {
      this.store.actions.MERGE({ toast: e.message || '保存失败' })
    } finally {
      this.store.actions.MERGE({ saving: false })
    }
  }
}
