import Controller from 'react-imvc/controller'
import * as Model from './Model'
import View from './View'
import { login as loginApi, register as registerApi } from '../api/auth'
import { buildPath } from '../util/url'

export default class LoginController extends Controller {
  View = View
  Model = Model

  validateLogin() {
    const { loginUsername, loginPassword } = this.store.getState()
    if (!loginUsername || !loginUsername.trim()) return '请输入用户名'
    if (!loginPassword) return '请输入密码'
    return ''
  }

  validateRegister() {
    const s = this.store.getState()
    const u = (s.registerUsername || '').trim()
    if (!u) return '请输入用户名'
    if (u.length < 3 || u.length > 20) return '用户名 3～20 位'
    if (!s.registerPassword) return '请输入密码'
    if (s.registerPassword.length < 6 || s.registerPassword.length > 20) return '密码 6～20 位'
    if (s.registerConfirm !== s.registerPassword) return '两次密码不一致'
    const phone = (s.registerPhone || '').trim()
    if (!phone) return '请输入手机号'
    if (!/^1\d{10}$/.test(phone)) return '手机号格式不正确'
    return ''
  }

  async submitLogin() {
    const err = this.validateLogin()
    if (err) {
      this.store.actions.MERGE({ toast: err })
      return
    }
    this.store.actions.MERGE({ loginLoading: true, toast: '' })
    try {
      const s = this.store.getState()
      const res = await loginApi({
        username: s.loginUsername.trim(),
        password: s.loginPassword,
      })
      const { data } = res
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', String(data.userId))
        localStorage.setItem('username', data.username)
      }
      this.store.actions.MERGE({ loginLoading: false, toast: '登录成功' })
      this.history.push(buildPath('/home', {}))
    } catch (e) {
      this.store.actions.MERGE({
        loginLoading: false,
        toast: e.message || '登录失败',
      })
    }
  }

  async submitRegister() {
    const err = this.validateRegister()
    if (err) {
      this.store.actions.MERGE({ toast: err })
      return
    }
    this.store.actions.MERGE({ registerLoading: true, toast: '' })
    const s = this.store.getState()
    try {
      await registerApi({
        username: s.registerUsername.trim(),
        password: s.registerPassword,
        phone: s.registerPhone.trim(),
        idCard: (s.registerIdCard || '').trim() || undefined,
      })
      this.store.actions.AFTER_REGISTER({ username: s.registerUsername.trim() })
    } catch (e) {
      this.store.actions.MERGE({
        registerLoading: false,
        toast: e.message || '注册失败',
      })
    }
  }
}