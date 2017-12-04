export default function reducer( state = {
    currentClassroom: {},
    classrooms: [],
    live_assignments: [],
    current_target_student: null,
    all_assessments: null,
    selected_assessment: null,
    done_selecting: false,
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
    case 'SET_ALL_LIVE_ASSIGNMENTS': {
      return {...state,
        live_assignments: action.payload.live_assignments
      }
    }
    case 'SET_TARGET_STUDENT': {
      return {...state,
        current_target_student: action.payload.current_target_student
      }
    }
    case 'STORE_ALL_ASSESSMENTS': {
      return {...state,
        all_assessments: action.payload.all_assessments
      }
    }
    case 'ASSIGN_ASSESSMENT': {
      return {...state,
        selected_assessment: action.payload.selected_assessment
      }
    }
    case 'RECORD_ASSIGNMENT': {
      return {...state,
        done_selecting: true
      }
    }
    case 'RESET_SELECT_ASSESSMENT': {
      return {...state,
        done_selecting: false,
        selected_assessment: null
      }
    }
  }
  return state;
}