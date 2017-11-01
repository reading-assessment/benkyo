export default function reducer( state = {
  uid: 'Fountas & Pinnel',
  }, action ) {

  switch (action.type) {
    case 'SET_UID': {
      return {...state,
        uid: action.payload.uid
      }
    }
  }
  return state;
}