export const initialState ={trainId:'',from:'',to:'',date:'',ticketType:'normal',higeSpeedOnly:'0',loading:false,errorMsg:'',train:null,seatType:'',quantity:1,passengerName:'',idCard:'',submitting:false}

export const MERGE =(state,partial)=>({...state,...partial})