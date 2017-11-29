export default function reducer( state = {
  profile: {},
  enrolledClasses: {}
  }, action ) {

  switch (action.type) {
    case 'SET_CURRENT_PROFILE': {
      return {...state,
        profile: action.payload.profile
      }
    }
    case 'SET_CURRENT_CLASSES': {
      return {...state,
        enrolledClasses: action.payload.enrolledClasses
      }
    }
  }
  return state;
}