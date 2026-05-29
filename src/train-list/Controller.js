import Controller from 'react-imvc/controller'
import * as Model from './Model'
import View from './View'
import { fetchTrainList } from '../api/train'
import { buildPath } from '../util/url'

export default class TrainListController extends Controller{
 View = View
 Model = Model
 getInitialState(state){
    const query = (state.location && state.location.query) || {}
    return{
        ...Model.initialState,
        ...state,
        from: query.from || '—',
        to: query.to || '—',
        date: query.date || '—',
        ticketType: query.ticketType || 'normal',
        highSpeedOnly: query.highSpeedOnly === '1'
        }
}
async loadList(){
    const state =this.store.getState()
    this.store.actions.MERGE({loading:true,errorMsg:''})
    try{
        const response =await fetchTrainList({from:state.from,to:state.to,date: state.date, ticketType: state.ticketType, highSpeedOnly: state.highSpeedOnly ? '1' : '0' })
        this.store.actions.MERGE({list:response.data || []})
    }
    catch(error){
        this.store.actions.MERGE({ errorMsg: error.message || '加载失败', list: [] }) // 显示错误
    } finally { // 无论成功失败
      this.store.actions.MERGE({ loading: false }) // 结束加载
    } 
  } 
}

