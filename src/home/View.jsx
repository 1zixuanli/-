import React from 'react' // 导入 React
export default function View({ state, ctrl }) { // 定义首页视图
  const actions = ctrl.store.actions // 取出 actions
  return ( // 返回页面结构
    <div> {/* 页面根容器 */}
      <header> {/* 顶部区域 */}
        <span>铁路车票系统</span> {/* 系统标题 */}
        <span>{state.username} <button type="button" onClick={() => ctrl.logout()}>退出</button></span> {/* 用户信息和退出按钮 */}
      </header> {/* 顶部结束 */}
      {state.toast ? <p>{state.toast}</p> : null} {/* 有提示就显示 */}
      <div> {/* 行程类型 */}
        <button type="button" onClick={() => actions.MERGE({ tripType: 'oneWay' })}>单程</button> {/* 单程按钮 */}
        <button type="button" onClick={() => actions.MERGE({ tripType: 'roundTrip' })}>往返</button> {/* 往返按钮 */}
      </div> {/* 行程类型结束 */}
      <div> {/* 站点选择 */}
        <button type="button" onClick={() => ctrl.openCityPicker('from')}>{state.fromCity || '请选择出发站'}</button> {/* 出发站按钮 */}
        <button type="button" onClick={() => actions.SWAP_STATIONS()}>交换</button> {/* 交换按钮 */}
        <button type="button" onClick={() => ctrl.openCityPicker('to')}>{state.toCity || '请选择到达站'}</button> {/* 到达站按钮 */}
      </div> {/* 站点选择结束 */}
      <div> {/* 日期和筛选条件 */}
        <input type="date" value={state.travelDate} onChange={(event) => actions.MERGE({ travelDate: event.target.value })} /> {/* 日期选择 */}
        <label><input type="checkbox" checked={state.multiDayCommute} onChange={(event) => actions.MERGE({ multiDayCommute: event.target.checked })} />多日通勤</label> {/* 多日通勤 */}
      </div> {/* 日期区域结束 */}
      <div> {/* 票种区域 */}
        <label><input type="radio" name="ticketType" checked={state.ticketType === 'normal'} onChange={() => actions.MERGE({ ticketType: 'normal' })} />普通</label> {/* 普通票 */}
        <label><input type="radio" name="ticketType" checked={state.ticketType === 'student'} onChange={() => actions.MERGE({ ticketType: 'student' })} />学生票</label> {/* 学生票 */}
        <label><input type="radio" name="ticketType" checked={state.ticketType === 'group'} onChange={() => actions.MERGE({ ticketType: 'group' })} />团体票</label> {/* 团体票 */}
        <label><input type="checkbox" checked={state.highSpeedOnly} onChange={(event) => actions.MERGE({ highSpeedOnly: event.target.checked })} />高铁动车</label> {/* 高铁过滤 */}
      </div> {/* 票种区域结束 */}
      <button type="button" onClick={() => ctrl.handleQuery()}>查询</button> {/* 查询按钮 */}
      <hr /> {/* 分隔线 */}
      <button type="button" onClick={() => ctrl.history.push('/profile')}>个人中心</button> {/* 个人中心 */}
      <button type="button" onClick={() => ctrl.history.push('/orders')}>我的订单</button> {/* 我的订单 */}
      {state.isAdmin ? <button type="button" onClick={() => ctrl.history.push('/admin')}>管理后台</button> : null} {/* 管理后台入口 */}
    </div> // 根容器结束
  ) // 返回结束
} // 组件结束