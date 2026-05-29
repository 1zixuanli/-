export const initialState = {
  username: '',
  phone: '',
  idCard: '',
  loading: false,
  saving: false,
  toast: '',
}

export const MERGE = (state, partial) => ({ ...state, ...partial })
