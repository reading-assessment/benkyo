import { Card, Feed, Dimmer, Segment, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetAllClassrooms, SetCurrentClassrooms, SetTargetStudent, ResetSelectAssessment } from './TeacherActions'
import Promise from 'bluebird'
import _ from 'lodash';

import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


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

    this.scrollToTop = this.scrollToTop.bind(this);

  }

  scrollToTop(){
    scroll.scrollToTop();
  }

  componentDidMount() {
    Events.scrollEvent.register('begin', function () {
      console.log("begin", arguments);
    });
    Events.scrollEvent.register('end', function () {
      console.log("end", arguments);
    });
  }



  render() {
    const {classrooms, currentClassroom} = this.props;
    if (currentClassroom.students) {
      var sorted_student = _.sortBy(currentClassroom.students, [function(o) { return o.profile.name.fullName; }]);
      var renderStudents = (
        <Feed>
          {sorted_student.map(function(student, key){
            var studentObj_withClassRoom = student;
            studentObj_withClassRoom['descriptionHeading'] = currentClassroom.descriptionHeading;
            return(

             <Feed.Event as='a' onClick= {()=>{
               this.props.dispatch(SetTargetStudent(studentObj_withClassRoom)); 
               this.props.dispatch(ResetSelectAssessment());
               this.scrollToTop();
               }} >

                <Feed.Label image={student.profile.photoUrl} />
                <Feed.Content>
                  <Feed.Date>
                    <Segment vertical style={{padding: '0px'}}>
                    {student.profile.name.fullName}
                    </Segment>
                  </Feed.Date>
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

