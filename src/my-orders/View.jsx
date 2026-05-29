import React,{useEffect}from 'react'

export default function View({state,ctrl}){
    useEffect(()=>{ctrl.load()},[])
   const actions =ctrl.store.actions
   const filtered =state.statusFilter === 'all'?state.list:state.list.filter((item)=>item.status === state.statusFilter)

   return (
    <div>
        <header><button type="button" onClick={()=>ctrl.history.push('/home')}>首页</button><span>我的订单</span></header>
        <select value={state.statusFilter} onChange={(event)=>actions.MERGE({statusFilter:event.target.value})}>
           <option value="all">全部</option>
           <option value="unpaid">待支付</option>
           <option value="paid">已支付</option>
           <option value="complete">已完成</option>
           <option value="cancelled">已取消</option>
           <option value="refunded">已退票</option>
        </select>
        {state.loading ? <p>加载中...</p>:null}
        {state.errorMsg ? <p>{state.errorMsg}</p>:null}
        {filtered.map((item)=>(
            <div key={item.orderId} style={{ border: '1px solid #ddd', marginBottom: 12, padding: 12 }}>
               <p>订单号：{item.orderId}</p>
               <p>{`${item.trainNo} ${item.fromStation} -> ${item.toStation} ${item.travelDate}`}</p>
               <p>{`${item.seatName} ${item.quantity ||1}张 合计 ¥${item.price}`}</p>
               <p>状态：{item.status}</p>
               {item.state === 'unpaid'?<button type="button" disabled={state.actingId === item.orderId} onClick={()=>ctrl.operate('pay',item.orderId)}>支付</button> :null}
               {item.state === 'unpaid'?<button typr="button" disabled={state.actingId === item.orderId} onClick={()=>ctrl.operate('cancel',item.orderId)}>取消</button> :null}
               {item.state === 'paid'?<button type="button" disabled={state.actingId === item.orderId} onClick={()=>ctrl.operate('refund',item.orderId)}>退票</button> :null}
               {item.state === 'paid'?<button typr="buttom" disabled={state.actingId === item.orderId} onClick={()=>ctrl.operate('complete',item.orderId)}>确认出行</button>:null}
            </div>
        ))
    }
    </div>
   )
}