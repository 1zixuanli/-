const ENABLE_MOCK = true

function mockRegister(form) {
    return Promise.resolve({
        code:0,
        message:'注册成功',
        data:{useId:1,userName:form?.username ||'user'},
    })
}

function mockLogin(data){
    return Promise.resolve({
        code:0,
        message:'登录成功',
        data:{token:'mock-token-'+Date.now(),
            userId:1,
            username:data?.username ||'user',
        },
    })
}

export function register(form){
    if(ENABLE_MOCK){return mockRegister(form)}
    return fetch('/api/user/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(form),
    })
    .then((r)=>r.json())
}
export function login(data){
    if(ENABLE_MOCK){return mockLogin(data)}
    return fetch('/api/user/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data),
    })
    .then((r)=>r.json())
}