import { renderToStaticMarkup } from "react-dom/server";

export const initialState={
    activeTab:'login',
    loginUsername:'',
    loginPassword:'',
    registerUsername:'',
    registerPassword:'',
    registerPasswordConfirm:'',
    registerPhone:'',
    registerIdCard:'',
    loginLoading:false,
    registerLoading:false,
    toast:'',
}
export const MERGE =(state,partial)=>({
    ...state,
    ...partial,
})

export const AFTER_REGISTER=(state,{username})=>({
    ...state,
    registerLoading:false,
    activeTab:'login',
    loginUsername:username,
    loginPassword:'',
    toast:'注册成功,请登录',
})