export function SetCurrentClassrooms (classrooms) {
  return {
    type: 'SET_CLASSROOMS',
    payload: {
      classrooms: classrooms
    }
  }
}