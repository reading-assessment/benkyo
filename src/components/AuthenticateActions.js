export function SetMainView (view) {
  return {
    type: 'SET_MAIN_VIEW',
    payload: {
      change_main_view: view
    }
  }
}

export function SetUserCred (user_cred) {
  return {
    type: 'SET_USER_CRED',
    payload: {
      user_cred: user_cred
    }
  }
}

export function SetMainRole (role) {
  return {
    type: 'SET_ROLE',
    payload: {
      role: role
    }
  }
}

export function LogOut () {
  return {
    type: 'LOG_OUT'
  }
}

export function StudentLogOut () {
  return {
    type: 'STUDENT_LOG_OUT'
  }
}

export function TeacherLogOut () {
  return {
    type: 'TEACHER_LOG_OUT'
  }
}