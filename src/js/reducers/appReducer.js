import { NOT_FOUND } from 'redux-first-router'

export const appReducer = (state = null, action = {}) => {
  switch(action.type) {
    case 'HOME':
    case NOT_FOUND:
      return null
    case 'APP':
      return action.payload.id
    default: 
      return state
  }
}
