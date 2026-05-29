 export const initialState = {}
  
  export const MERGE = (state, partial) => ({
    ...state,
    ...partial,
  })