export function SetCurrentProfile (profile) {
  return {
    type: 'SET_CURRENT_PROFILE',
    payload: {
      profile: profile
    }
  }
}

export function SetCurrentClasses (classes) {
  return {
    type: 'SET_CURRENT_CLASSES',
    payload: {
      enrolledClasses: classes
    }
  }
}