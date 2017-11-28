import { Table, Checkbox, Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetAllClassrooms, SetCurrentClassrooms } from './TeacherActions'

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    dummyData: [
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
      { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'}
    ]
  }
})


class TeacherDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const{user_cred, classrooms} = this.props;
    firebase.database().ref(`teacher/${user_cred.uid}/classes`).once('value').then(function(snapshot){
      var arrayOfClasses = [];
      var currentClassroom = null;
      snapshot.forEach(function(classes){
        arrayOfClasses.push(classes.val());
        if (!currentClassroom) {
          currentClassroom = classes.val();
          firebase.database().ref(`/classes/${currentClassroom}`).once('value').then(function(snapshot){
            if (snapshot.val()){
              this.props.dispatch(SetCurrentClassrooms(snapshot.val()));
            }
          }.bind(this))
        }
      }.bind(this));
      this.props.dispatch(SetAllClassrooms(arrayOfClasses));
    }.bind(this))
  }

  render() {
    const {dummyData} = this.props;
    return (
      <Segment vertical>
        <Grid>
          <Grid.Row>
            <Grid.Column width={11}>
              <Table compact celled definition>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Student Name</Table.HeaderCell>
                    <Table.HeaderCell>Raw Score</Table.HeaderCell>
                    <Table.HeaderCell>Student Reading</Table.HeaderCell>
                    <Table.HeaderCell>Assigned Assessment</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {dummyData.map((performance)=>{
                    return (
                      <Table.Row>
                        <Table.Cell collapsing>
                          <Checkbox slider />
                        </Table.Cell>
                        <Table.Cell>{performance.studentName}</Table.Cell>
                        <Table.Cell>{performance.rawScore}</Table.Cell>
                        <Table.Cell>{performance.studentReading}</Table.Cell>
                        <Table.Cell>{performance.AssignedAssessment}</Table.Cell>
                      </Table.Row>
                    )
                  })}

                </Table.Body>

                <Table.Footer fullWidth>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan='4'>
                      <Button floated='right' icon labelPosition='left' primary size='small'>
                        <Icon name='user' /> Add User
                      </Button>
                      <Button size='small'>Approve</Button>
                      <Button disabled size='small'>Approve All</Button>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
            <Grid.Column width={5}>
              <ClassroomByGoogle/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

window.TeacherDashboard = TeacherDashboard;