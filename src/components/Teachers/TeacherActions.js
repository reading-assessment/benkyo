// --- TEST: for academic record page ----
export function SetListOfStudents (currentStudentList) {
  return {
    type: 'SET_ALL_STUDENTS_IN_CLASS',
    payload: {
      currentStudentList: currentStudentList
    }
  }
}

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

export function SetAllLiveAssignments (live_assignments) {
  return {
    type: 'SET_ALL_LIVE_ASSIGNMENTS',
    payload: {
      live_assignments: live_assignments
    }
  }
}

export function SetTargetStudent (student) {
  return {
    type: 'SET_TARGET_STUDENT',
    payload: {
      current_target_student: student
    }
  }
}

export function StoreAllAssessments (all_assessments) {
  return {
    type: 'STORE_ALL_ASSESSMENTS',
    payload: {
      all_assessments: all_assessments
    }
  }
}

export function SelectAssessment( assessment ) {
  return {
    type: 'ASSIGN_ASSESSMENT',
    payload: {
      selected_assessment: assessment
    }
  }
}

export function AssignItinStone() {
  return {
    type: 'RECORD_ASSIGNMENT'
  }
}

export function ResetSelectAssessment() {
  return {
    type: 'RESET_SELECT_ASSESSMENT'
  }
}