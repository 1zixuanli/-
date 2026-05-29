import React,{useEffect}from 'react'
export default function View({state,ctrl}){
    useEffect(()=>{ctrl.loadTrain()},[])
    const currentSeat = state.train ? (state.train.seatTypes || []).find((item) => item.seatType === state.seatType) : null
    const displayPrice =(price)=>state.ticketType==='student'?Math.round(Number(price)*0.75):state.ticketType==='group'?Math.round(Number(price)*0.95):Number(price)
    const totalPay =currentSeat?displayPrice(currentSeat.price)*state.quantity:0
    const actions =ctrl.store.actions      
    return(
        <div>
            <header><button type="button" onClick={()=>ctrl.history.goBack()}>返回</button><span>确认订单</span></header>
            {state.loading ?<p>加载中...</p>:null}
            {state.errorMsg?<p>{state.errorMsg}</p>:null}
            {state.train?(
            <div>
                <p>车次：{state.train.trainNo}</p>
                <p>区间：{`${state.train.fromStation} -> ${state.train.toStation}`}</p>
                <p>日期：{state.date}</p>
                <div>
                    {(state.train.seatTypes||[]).map((seat)=>(
                         <label key={seat.seatType}>
                        <input key="radio" name="seatType"checked={state.seatType===seat.seatType}disabled={seat.remainCount<=0}onChange={()=>actions.MERGE({seatType:seat.seatType,quantity:1})}/>
                        {seat.seatName}余{seat.remainCount}￥{displayPrice(seat.price)}
                    </label>
                    ))}
                </div>
                <div>
                    <span>购票数量：</span>
                    <input type="number" min="1"max={currentSeat?currentSeat.remainCount:1}value={state.quantity}onChange={(event)=>actions.MERGE({quantity:Number(event.target.value)||1})}/>
                    </div>
                    <input value={state.passengerName}placeholder="乘车人姓名"onChange={(event)=>actions.MERGE({passengerName:event.target.value})}/>
                    <input value={state.idCard} placeholder="身份证号（选填）" onChange={(event) => actions.MERGE({ idCard: event.target.value })} />
                    <p>应付：¥{totalPay}</p>
                    <button type="button" disabled={state.submitting} onClick={() => ctrl.submit()}>{state.submitting ? '提交中...' : '提交订单'}</button>
                    </div>
            ):null}     
        </div>
    )
}
