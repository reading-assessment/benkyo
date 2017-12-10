import { Table, Checkbox, Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetAllClassrooms, SetCurrentClassrooms, StoreAllAssessments, SetAllLiveAssignments } from './TeacherActions'
import Promise from 'bluebird';
import _ from 'lodash';
/*
@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    live_assignments: store.teacher.live_assignments
  }
})
 */

class TeacherDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.handleSort = this.handleSort.bind(this)
  }

  componentDidMount() {
    const{user_cred, classrooms} = this.props;
    firebase.database().ref(`assessments`).once('value').then(function(snapshot){
      this.props.dispatch(StoreAllAssessments(snapshot.val()))
    }.bind(this))
    return new Promise (function(resolve, reject){

      firebase.database().ref(`teacher/${user_cred.uid}/classes`).once('value').then(function(snapshot){
        var arrayOfClasses = [];
        var currentClassroom = null;
        snapshot.forEach(function(classes){
          arrayOfClasses.push(classes.val());
          if (!currentClassroom) {
            currentClassroom = classes.val();
            resolve(currentClassroom);
            firebase.database().ref(`/classes/${currentClassroom}`).once('value').then(function(snapshot){
              if (snapshot.val()){
                this.props.dispatch(SetCurrentClassrooms(snapshot.val()));
              }
            }.bind(this))
          }
        }.bind(this));
        this.props.dispatch(SetAllClassrooms(arrayOfClasses));
      }.bind(this))
    }.bind(this))
    .then(function(currentClassroom){
      firebase.database().ref(`assignment`).orderByChild('courseID').equalTo(currentClassroom).once('value')
      .then(function(snapshot){
        if (snapshot.val()) {
          var allLiveAssignments = [];
          snapshot.forEach(function(assignment){
            var results = assignment.val().results;
            var score = (results)?results.scoreFromCompareWord:null;
            var flacFile = (results)?results.publicFlacURL:null;

            var obj = {
              name: assignment.val().studentInfo.name.fullName,
              assessment: assignment.val().assessment,
              status: (results)?results.status:'Have not started',
              score: (score !== undefined && score !== null)?(<span>{new Number(score*100).toFixed(0).toString() + '%'}</span>):null,
              flac: (flacFile)?(<audio controls preload='auto'><source src={flacFile} type="audio/flac"/></audio>):null
            }
            allLiveAssignments.push(obj);
          })
          this.props.dispatch(SetAllLiveAssignments(allLiveAssignments));
        }
      }.bind(this))
    }.bind(this))
  }

  handleSort(clickedColumn) {
    const { column, direction } = this.state
    const {live_assignments} = this.props;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        direction: 'ascending'
      })
      this.props.dispatch(SetAllLiveAssignments(_.sortBy(live_assignments, [clickedColumn])));
      return
    }

    this.setState({
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
    this.props.dispatch(SetAllLiveAssignments(live_assignments.reverse()));
  }

  render() {
    const {dummyData, live_assignments, user_cred} = this.props;
    const {column, direction} = this.state;
    return (
      <Segment vertical>
        <Grid>
          <Grid.Row>
            <Grid.Column width={11}>
              <AssignAssessment/>
              <Table celled sortable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={()=>{this.handleSort('name')}}>Student</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'assessment' ? direction : null} onClick={()=>{this.handleSort('assessment')}}>Assessment</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'status' ? direction : null} onClick={()=>{this.handleSort('status')}}>Status</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'score' ? direction : null} onClick={()=>{this.handleSort('score')}}>Raw Score</Table.HeaderCell>
                    <Table.HeaderCell>Recording</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {live_assignments.map((assignment, key)=>{
                    return (
                      <Table.Row>
                        <Table.Cell>{assignment.name}</Table.Cell>
                        <Table.Cell>{assignment.assessment}</Table.Cell>
                        <Table.Cell>{assignment.status}</Table.Cell>
                        <Table.Cell>{assignment.score}</Table.Cell>
                        <Table.Cell>{assignment.flac}</Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
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


window.TeacherDashboard = connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    live_assignments: store.teacher.live_assignments
  }
})(TeacherDashboard);



//window.TeacherDashboard = TeacherDashboard;