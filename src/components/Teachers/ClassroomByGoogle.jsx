import { Card, Feed } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetAllClassrooms, SetCurrentClassrooms, SetTargetStudent, ResetSelectAssessment } from './TeacherActions'
import Promise from 'bluebird'

/* @connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role,
    classrooms: store.teacher.classrooms,
    currentClassroom: store.teacher.currentClassroom,
  }
})
 */
class ClassroomByGoogle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    const {classrooms, currentClassroom} = this.props;
    if (currentClassroom.students) {
      var studentArray = [];
      for (var student in currentClassroom.students) {
        studentArray.push(currentClassroom.students[student]);
      }

      var renderStudents = (
        <Feed>
          {studentArray.map(function(student, key){
            return(
              <Feed.Event as='a' onClick={()=>{this.props.dispatch(SetTargetStudent(student)); this.props.dispatch(ResetSelectAssessment())}}>
                <Feed.Label image={student.profile.photoUrl} />
                <Feed.Content>
                  <Feed.Date content={student.profile.name.fullName} />
                  <Feed.Summary>
                    {student.profile.emailAddress}
                  </Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            )
          }.bind(this))}
        </Feed>
      )
    }
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {currentClassroom.descriptionHeading}
          </Card.Header>
        </Card.Content>
        <Card.Content>
          {renderStudents}
        </Card.Content>
      </Card>
    )
  }
}


window.ClassroomByGoogle = connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role,
    classrooms: store.teacher.classrooms,
    currentClassroom: store.teacher.currentClassroom
  }
})(ClassroomByGoogle);


// window.ClassroomByGoogle = ClassroomByGoogle

