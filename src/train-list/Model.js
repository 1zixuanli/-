export const initialState = {
    from:'-',
    to:'-',
    date:'-',
    ticketType:'normal',
    highSpeedOnly:false,
    loading:false,
    errorMsg:'',
    list:[],
}
export const MERGE =(state,partial)=>({...state,...partial})