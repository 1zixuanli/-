export const initialState = { loading: false, errorMsg: '', statusFilter: 'all', actingId: '', list: [] } // 初始状态
export const MERGE = (state, partial) => ({ ...state, ...partial }) // 合并状态