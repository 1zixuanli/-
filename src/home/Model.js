export const initialState = { // 定义首页初始状态
  username: '用户', // 默认用户名
  isAdmin: false, // 是否管理员
  tripType: 'oneWay', // 行程类型
  fromCity: '合肥', // 默认出发城市
  toCity: '北京', // 默认到达城市
  travelDate: new Date().toISOString().slice(0, 10), // 默认日期
  multiDayCommute: false, // 多日通勤开关
  ticketType: 'normal', // 默认票种
  highSpeedOnly: false, // 是否只看高铁
  toast: '', // 提示信息
} // 初始状态结束
export const MERGE = (state, partial) => ({ ...state, ...partial }) // 通用合并方法
export const SWAP_STATIONS = (state) => ({ ...state, fromCity: state.toCity, toCity: state.fromCity }) // 交换出发和到达站
