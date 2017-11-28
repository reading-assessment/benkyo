export function SetCurrentClassrooms (currentClassroom) {
  return {
    type: 'SET_CURRENT_CLASSROOM',
    payload: {
      currentClassroom: currentClassroom
    }
  }
}

export function SetAllClassrooms (classrooms) {
  return {
    type: 'SET_ALL_CLASSROOMS',
    payload: {
      classrooms: classrooms
    }
  }
}