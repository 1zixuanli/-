import Controller from 'react-imvc/controller' // 导入控制器基类
import * as Model from './Model' // 导入状态模型
import View from './View' // 导入页面视图
import { buildPath } from '../util/url' // 导入路径拼接工具
export default class HomeController extends Controller { // 定义首页控制器
  View = View // 绑定视图
  Model = Model // 绑定模型
  getInitialState(state) { // 初始化页面状态
    const query = (state.location && state.location.query) || {} // 获取地址栏参数
    return { // 返回初始化后的状态
      ...state, // 保留原始状态
      username: localStorage.getItem('username') || '用户', // 从本地读取用户名
      isAdmin: localStorage.getItem('role') === 'admin', // 判断是否管理员
      fromCity: query.from || Model.initialState.fromCity, // 出发城市优先取 query
      toCity: query.to || Model.initialState.toCity, // 到达城市优先取 query
    } // 返回结束
  } // 初始化结束
  openCityPicker(field) { // 打开选城市页
    const state = this.store.getState() // 获取当前状态
    const current = field === 'from' ? state.fromCity : state.toCity // 根据 field 判断当前高亮的城市
    this.history.push(buildPath('/city-picker', { field, current })) // 跳转到选城市页
  } // 方法结束
  handleQuery() { // 点击查询按钮
    const state = this.store.getState() // 获取当前状态
    const from = (state.fromCity || '').trim() // 清洗出发城市
    const to = (state.toCity || '').trim() // 清洗到达城市
    if (!from || !to) return this.store.actions.MERGE({ toast: '请选择出发站和到达站' }) // 站点为空时提示
    if (from === to) return this.store.actions.MERGE({ toast: '出发站和到达站不能相同' }) // 两个城市相同时提示
    this.history.push(buildPath('/trainList', { from, to, date: state.travelDate, highSpeedOnly: state.highSpeedOnly ? '1' : '0', ticketType: state.ticketType })) // 跳转到车票列表页
  } // 方法结束
  logout() { // 退出登录
    localStorage.removeItem('token') // 清除 token
    localStorage.removeItem('userId') // 清除 userId
    localStorage.removeItem('username') // 清除 username
    localStorage.removeItem('role') // 清除角色
    this.history.push('/login') // 返回登录页
  } // 方法结束
} // 控制器结束