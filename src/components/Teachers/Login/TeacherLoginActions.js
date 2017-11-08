export function SetAuthenticatedUID (new_uid) {
  return {
    type: 'SET_UID',
    payload: {
      uid: new_uid
    }
  }
}