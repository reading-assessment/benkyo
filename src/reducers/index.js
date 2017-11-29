import { combineReducers } from 'redux'

import authentication from './AuthenticationReducer'
import student from './StudentReducer'
import teacher from './TeacherReducer'

export default combineReducers({
  authentication,
  student,
  teacher
})