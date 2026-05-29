export function buildPath(path,query){
    const qs = new URLSearchParams()
    if(!query)return path
    Object.keys(query).forEach((k)=>{
        const v = query[k]
        if(v !==null && v!=='')qs.set(k,String(v))       
    })
const s=qs.toString()
return s?`${path}?${s}`:path
}