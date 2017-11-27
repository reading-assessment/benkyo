export default function reducer( state = {
  uid: null,
  role: null,
  user_cred: {},
  change_main_view: 'Landing_Page',
  classrooms: []
  }, action ) {

  switch (action.type) {
    case 'SET_UID': {
      return {...state,
        uid: action.payload.uid
      }
    }
    case 'SET_USER_CRED': {
      return {...state,
        user_cred: action.payload.user_cred
      }
    }
    case 'SET_MAIN_VIEW': {
      return {...state,
        change_main_view: action.payload.change_main_view
      }
    }
    case 'SET_ROLE': {
      return {...state,
        role: action.payload.role
      }
    }
    case 'SET_CLASSROOMS': {
      return {...state,
        classrooms: action.payload.classrooms
      }
    }
    case 'LOG_OUT': {
      return {...state,
        role: 'Student',
        user_cred: {},
        change_main_view: 'Landing_Page',
        uid: null
      }
    }
  }
  return state;
}