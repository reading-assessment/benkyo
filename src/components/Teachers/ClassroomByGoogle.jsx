import { Card, Feed } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetCurrentClassrooms } from './TeacherActions'

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role,
    classrooms: store.authentication.classrooms
  }
})

class ClassroomByGoogle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const{user_cred} = this.props;
    firebase.database().ref(`teacher/${user_cred.uid}/classes`).once('value').then(function(snapshot){
      var array = [];
      snapshot.forEach(function(course){
        var obj = course.val();
        obj.courseID = course.key;
        array.push(obj);
      })
      this.props.dispatch(SetCurrentClassrooms(array));
    }.bind(this))
  }

  render() {
    const {classrooms} = this.props;
    return (
      <div>
        {classrooms.map(function(course, key){
          var students = [];
          for (var obj in course.students){
            students.push (course.students[obj]);
          }
          return(
            <Card>
              <Card.Content>
                <Card.Header>
                  {course.descriptionHeading}
                </Card.Header>
              </Card.Content>
              <Card.Content>
                <Feed>
                  {students.map(function(student, key){
                    return (
                      <Feed.Event>
                        <Feed.Label image={student.profile.photoUrl} />
                        <Feed.Content>
                          <Feed.Date content={student.profile.name.fullName} />
                          <Feed.Summary>
                            {student.profile.emailAddress}
                          </Feed.Summary>
                        </Feed.Content>
                      </Feed.Event>
                    )
                  })}
                </Feed>
              </Card.Content>
            </Card>
          )
        })}
      </div>
    )
  }
}

window.ClassroomByGoogle = ClassroomByGoogle