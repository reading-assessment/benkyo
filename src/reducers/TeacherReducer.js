export default function reducer( state = {
    currentClassroom: {},
    classrooms: []
  }, action ) {
  switch (action.type) {
    case 'SET_ALL_CLASSROOMS': {
      return {...state,
        classrooms: action.payload.classrooms
      }
    }
    case 'SET_CURRENT_CLASSROOM': {
      return {...state,
        currentClassroom: action.payload.currentClassroom
      }
    }
  }
  return state;
}