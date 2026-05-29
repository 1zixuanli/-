import Controller from 'react-imvc/controller'
import * as Model from './Model'
import View from './View'
import {fetchTrainList} from '../api/train'
import {createOrder} from '../api/order'

export default class OrderConfirmController extends Controller{
    view = View
    Model = Model
    getInitialState(state){
        const query = (state.location&&state.location.query)||{}
        return{
            ...Model.initialState,
            ...state,
            trainId:query.trainId||'',
            from:query.from||'',
            to:query.to||'',
            date:query.date||'',            
            ticketType:query.ticketType||'normal',
            highSpeedOnly:query.highSpeedOnly||'0'
        }
    }
        async loadTrain(){
            const state = this.store.getState()
            this.store.actions.MERGE({loading:true,errorMsg:''})
            try{
                const response = await fetchTrainList({
                    from:state.from,
                    to:state.to,
                    date:state.date,
                    ticketType:state.ticketType,
                    highSpeedOnly:state.highSpeedOnly?'1':'0'
                })
                const train =(response.data||[]).find((item)=>item.trainId===state.trainId)
                if(!train)throw new Error('未找到该车次')
                const firstSeat=(train.seatTypes || []).find((item)=>item.remainCount >0)
                this.store.actions.MERGE({train,seatType:firstSeat?firstSeat.seatType:''})
            }catch(error){
                this.store.actions.MERGE({errorMsg:error.message||'加载失败'})
            }finally{
                this.store.actions.MERGE({loading:false})
            }
        }
        async submit(){
            const state = this.store.getState()
            if(!state.passengerName.trim() ||state.passengerName.trim().length<2)
                return this.store.actions.MERGE({errorMsg:'请填写乘车人姓名'})
                this.store.actions.MERGE({submitting:true,errorMsg:''})
            try{
                await createOrder({trainId:state.train.trainId,toStation:state.train.toStation,travelDate:state.date,departTime:state.train.departTime,arriveTime:state.train.arriveTime,seatType:state.seatType,quantity:state.quantity,passengerName:state.passengerName.trim(),idCard:state.idCard.trim(),ticketType:state.ticketType})
                this.history.push('/orders/')
            }catch(error){
                this.store.actions.MERGE({errorMsg:error.message||'提交失败'})
            }finally{
                this.store.actions.MERGE({submitting:false})
            }
        }
    }