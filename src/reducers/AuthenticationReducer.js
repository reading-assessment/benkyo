export default function reducer( state = {
  uid: 'Fountas & Pinnel',
  user_cred: {},
  change_main_view: 'Landing_Page'
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
  }
  return state;
}