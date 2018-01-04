import React from 'react';
import { Table, Checkbox, Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetAllClassrooms, SetCurrentClassrooms, StoreAllAssessments, SetAllLiveAssignments } from './TeacherActions'
import Promise from 'bluebird';
import _ from 'lodash';
import AssignAssessment from './AssignAssessment.jsx'

export default connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    live_assignments: store.teacher.live_assignments
  }
})(
class TeacherDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.handleSort = this.handleSort.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    const{user_cred, classrooms} = this.props;
    firebase.database().ref(`assessments`).once('value').then(function(snapshot){
      this.props.dispatch(StoreAllAssessments(snapshot.val()))
    }.bind(this))
    new Promise (function(resolve, reject){

      firebase.database().ref(`teacher/${user_cred.uid}/classes`).once('value').then(function(snapshot){
        var arrayOfClasses = [];
        var currentClassroom = null;
        // How does this works, as it sores an array with the -primary content and the class content?
        snapshot.forEach(function(classes){
          arrayOfClasses.push(classes.val());
          if (!currentClassroom) {
            // does it resolve ONLY in the first classroom that it finds?
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
            var assignmentId = assignment.key;
            var results = assignment.val().results;
            var score = (results)?results.scoreFromCompareWord:null;
            var flacFile = (results)?results.publicFlacURL:null;
            var wordsPerMinute = (results)?results.transcribedWordsPerMinute:null;
            var numOfRecordingSeconds = (results)?results.numOfRecordingSeconds:null;
            var timeStamp = (results)?results.timeStamp:null;
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var strDate = null;
            if (timeStamp) {
              timeStamp = Number(timeStamp);
              var date = new Date(timeStamp);
              strDate = months[date.getMonth()] +'-'+ date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
            }
            var obj = {
              assignmentId,
              email: assignment.val().studentInfo.emailAddress,
              name: assignment.val().studentInfo.name.fullName,
              assessment: assignment.val().assessment,
              status: (results)?results.status:'Have not started',
              score: (score !== undefined && score !== null)?(<span>{new Number(score*100).toFixed(0).toString() + '%'}</span>):null,
              flac: (flacFile)?(<audio controls preload='auto'><source src={flacFile} type="audio/flac"/></audio>):null,
              wordsPerMinute: (wordsPerMinute !== undefined && wordsPerMinute !== null)?wordsPerMinute:null,
              numOfRecordingSeconds: (numOfRecordingSeconds !== undefined && numOfRecordingSeconds !== null)?numOfRecordingSeconds:null,
              timeStamp: (timeStamp !== undefined && timeStamp !== null)?timeStamp:null,
              strDate: (strDate !== undefined && strDate !== null)?strDate:null
            }
            allLiveAssignments.push(obj);
          });
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

  handleDelete(assignmentId, email){
    const {live_assignments} = this.props;
    var liveAssignmentsCopy = live_assignments.slice(0);
    _.remove(liveAssignmentsCopy, (item)=>{ return item.assignmentId === assignmentId });
    this.props.dispatch(SetAllLiveAssignments(liveAssignmentsCopy));
    var emailWithCommas = email.replace(/\./g, ',');
    firebase.database().ref(`emailToUid/${emailWithCommas}`).once('value').then(function(snapshot){
      if (snapshot.val()){
        var clickedStudentUid = snapshot.val();
        firebase.database().ref(`student/${clickedStudentUid}/assignment/${assignmentId}`).once('value').then(function(snapshot){
          if (snapshot.val()) {
            firebase.database().ref(`student/${clickedStudentUid}/assignment/${assignmentId}`).remove().then(function(snapshot){
              console.log("successful removed #1 ", assignmentId);
            });
          }
        });
      }
    });
    firebase.database().ref(`assignment/${assignmentId}`).remove().then(function (snapshot) {
      console.log("successful removed #2 ", assignmentId);
    });
  }

  render() {
    const {live_assignments, user_cred} = this.props;
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
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {live_assignments.map((assignment, key)=>{
                    return (
                      <Table.Row key={key}>
                        <Table.Cell>{assignment.name}</Table.Cell>
                        <Table.Cell>{assignment.assessment}</Table.Cell>
                        <Table.Cell>{assignment.status}</Table.Cell>
                        <Table.Cell>{assignment.score}</Table.Cell>
                        <Table.Cell>{assignment.flac}</Table.Cell>
                        <Table.Cell textAlign="center"><Icon onClick={()=>{this.handleDelete(assignment.assignmentId, assignment.email)}} name="window close"/></Table.Cell>
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
});