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