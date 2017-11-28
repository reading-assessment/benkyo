import { combineReducers } from 'redux'

import authentication from './AuthenticationReducer'
import student from './StudentReducer'

export default combineReducers({
  authentication,
  student
})