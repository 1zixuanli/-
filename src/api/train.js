import{filterMockTrains}from'../data/mockTrainSchedule'
const ENABLE_MOCK = true
function mockGetTrainList(params){
    const data= filterMockTrains({from,to ,highSpeedOnly})
    return Promise.resolve({
        code:0,
        message:'获取车票列表成功',
        data,
        meta:{ticketType:ticketType||'normal'},
    })
}
export function fetchTrainList(params){
    if (ENABLE_MOCK) return mockGetTrainList(params)
        const qs=new URLSearchParams(params ||{}).toString()
        return fetch(`/api/train/list?${qs}`)
        .then((r)=>r.json())
}