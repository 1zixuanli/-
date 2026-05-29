import React, { useEffect } from 'react' // 导入 React 和 useEffect
export default function View({ state, ctrl }) { // 定义视图
  useEffect(() => { ctrl.loadList() }, []) // 页面首次进入时加载车次列表
  const displayPrice = (price) => { // 定义显示价格的方法
    const value = Number(price) // 转成数字
    if (state.ticketType === 'student') return Math.round(value * 0.75) // 学生票 75 折
    if (state.ticketType === 'group') return Math.round(value * 0.95) // 团体票 95 折
    return value // 普通票原价
  } // 方法结束
  return ( // 返回页面结构
    <div> {/* 根容器 */}
      <header><button type="button" onClick={() => ctrl.history.push('/home')}>返回</button><span>车票列表</span></header> {/* 头部 */}
      <p>{`${state.from} -> ${state.to} ${state.date}`}</p> {/* 查询摘要 */}
      {state.loading ? <p>加载中...</p> : null} {/* 加载提示 */}
      {state.errorMsg ? <p>{state.errorMsg}</p> : null} {/* 错误提示 */}
      {state.list.map((row) => ( // 遍历所有车次
        <div key={row.trainId} style={{ border: '1px solid #ddd', marginBottom: 12, padding: 12 }}> {/* 单个车次卡片 */}
          <h3>{row.trainNo} {row.departTime} - {row.arriveTime}</h3> {/* 车次标题 */}
          <p>{`${row.fromStation} -> ${row.toStation}`}</p> {/* 区间 */}
          {(row.seatTypes || []).map((seat) => ( // 遍历席别
            <div key={seat.seatType}> {/* 席别项 */}
              <span>{seat.seatName}</span> {/* 席别名 */}
              <span> ¥{displayPrice(seat.price)}</span> {/* 价格 */}
              <span> {seat.remainCount > 0 ? `余票 ${seat.remainCount}` : '无票'}</span> {/* 余票 */}
            </div> // 席别项结束
          ))} {/* 席别遍历结束 */}
          <button type="button" onClick={() => ctrl.reserve(row)}>预订</button> {/* 预订按钮 */}
        </div> // 卡片结束
      ))} {/* 列表遍历结束 */}
    </div> // 根容器结束
  ) // 返回结束
} // 组件结束