import Controller from 'react-imvc/controller'
import * as Model from './Model'
import View from './View'
import { fetchOrderList, payOrder, cancelOrder, refundOrder, completeOrder } from '../api/order'

export default class MyOrdersController extends Controller{
    View = View
    Model = Model

    async load(){
        this.store.actions.MERGE({loading:true,errorMsg:''})
        try{
            const response =await fetchOrderList()
            this.store.actions.MERGE({list:response.data||[]})
        }catch(error){
            this.store.actions.MERGE({errorMsg:error.message||[]})
        }finally{
            this.store.actions.MERGE({loading:false})
        }
        }
        async operate(type,orderId){
            try{
                if(type === 'pay')await payOrder({orderId})
                if(type === 'cancel')await cancelOrder({orderId})
                if (type === 'refund') await refundOrder({ orderId })
                if (type === 'complete') await completeOrder({ orderId })
                await this.load()
        }catch(error){
            this.store.actions.MERGE({errorMsg:error.message|| '操作失败'})
        }finally{
            this.store.actions.MERGE({actingId:''})
        }
    }
}