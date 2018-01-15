import React from 'react';
import { Table, Checkbox, Button, Icon, Segment, Grid, Divider, Modal, Header, Dimmer } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetAllClassrooms, SetCurrentClassrooms, StoreAllAssessments, SetAllLiveAssignments } from './TeacherActions'
import Promise from 'bluebird';
import _ from 'lodash';
import AssignAssessment from './AssignAssessment.jsx'
import moment from 'moment'

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
      more_details: false,
      magnify_assessmentID: null,
      magnify_flac: null,
      magnify_transcribedText: null,
      dimmer_active: true
    }
    this.handleSort = this.handleSort.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.ViewMoreDetails = this.ViewMoreDetails.bind(this)
    this.resetModal = this.resetModal.bind(this);
  }

  componentDidMount() {
    const{user_cred, classrooms} = this.props;
    firebase.database().ref(`assessments`).orderByKey().once('value').then(function(snapshot){
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
            // console.log(currentClassroom);
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
      // firebase.database().ref(`assignment`).orderByChild('courseID').equalTo(currentClassroom).once('value')
      firebase.database().ref(`assignment`).once('value')
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
              score: (score !== undefined && score !== null)?(score):null,
              flac: (flacFile)?(<audio controls preload='auto'><source src={flacFile} type="audio/flac"/></audio>):null,
              wordsPerMinute: (wordsPerMinute !== undefined && wordsPerMinute !== null)?wordsPerMinute:null,
              numOfRecordingSeconds: (numOfRecordingSeconds !== undefined && numOfRecordingSeconds !== null)?numOfRecordingSeconds:null,
              timeStamp: (timeStamp !== undefined && timeStamp !== null)?timeStamp:null,
              strDate: (strDate !== undefined && strDate !== null)?strDate:null,
              transcribedText: (assignment.val().results)?assignment.val().results.transcribedText:null
            }
            if (results) {
              if (results.scoreFromFuzzySet){
                obj['scoreFromFuzzySet'] = results.scoreFromFuzzySet;
              }
            }
            allLiveAssignments.push(obj);
          });
          this.props.dispatch(SetAllLiveAssignments(allLiveAssignments));
        }
      }.bind(this))
    }.bind(this))
  }

  ViewMoreDetails(student, assessmentID, flac_info, transcribedText) {
    // console.log(assessmentID, flac_info, transcribedText);
    this.setState({
      magnify_student: student,
      magnify_assessmentID: assessmentID,
      magnify_flac: flac_info,
      magnify_transcribedText: transcribedText,
      more_details: true
    })
  }

  resetModal() {
    this.setState({
      magnify_student: null,
      magnify_assessmentID: null,
      magnify_flac: null,
      magnify_transcribedText: null,
      more_details: false
    })
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
    var confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
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
                // console.log("successful removed #1 ", assignmentId);
              });
            }
          });
        }
      });
      firebase.database().ref(`assignment/${assignmentId}`).remove().then(function (snapshot) {
        // console.log("successful removed #2 ", assignmentId);
      });
    }
  }

  render() {
    const {live_assignments, user_cred} = this.props;
    const {column, direction, more_details, magnify_student, 
      magnify_assessmentID,
      magnify_flac, 
      magnify_transcribedText
    } = this.state;

    return (
      <Segment vertical>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={11}>
              <AssignAssessment/>
              <Table celled sortable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={()=>{this.handleSort('name')}}>Student</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'assessment' ? direction : null} onClick={()=>{this.handleSort('assessment')}}>Assessment</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'status' ? direction : null} onClick={()=>{this.handleSort('status')}}>Status</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                    <Table.HeaderCell sorted={column === 'score' ? direction : null} onClick={()=>{this.handleSort('score')}}>Raw Score</Table.HeaderCell>
                    <Table.HeaderCell>Recording</Table.HeaderCell>
                    <Table.HeaderCell>Delete</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {live_assignments.map((assignment, key)=>{
                    if (assignment.scoreFromFuzzySet) {
                      var renderFuzzyScore = (
                        <div>
                          <Divider/>
                          {new Number(assignment.scoreFromFuzzySet*100).toFixed(0).toString() + '%'}
                        </div>
                      )
                    }
                    return (
                      <Table.Row key={key}>
                        <Table.Cell>
                          <Segment vertical style={{padding: '0px'}}>
                            {assignment.name}
                          </Segment>
                        </Table.Cell>
                        <Table.Cell>{assignment.assessment}</Table.Cell>
                        <Table.Cell>{assignment.status}</Table.Cell>
                        <Table.Cell>
                          {(assignment.timeStamp)?moment(assignment.timeStamp).format("ddd, MMM D, h:mm"):null}
                          <Divider/>
                          {(assignment.numOfRecordingSeconds)?`${new Number(assignment.numOfRecordingSeconds).toFixed(0)} Seconds`:null}
                          <Divider/>
                          {(assignment.wordsPerMinute)?<strong>{assignment.wordsPerMinute} WPM</strong>:null}
                        </Table.Cell>
                        <Table.Cell>
                          {(assignment.score)?(
                            <span>{new Number(assignment.score*100).toFixed(0).toString() + '%'}</span>
                          ):null}
                          {renderFuzzyScore}
                          {(assignment.score<.40 && assignment.score)?(
                            <span>
                              <Divider/>
                              High chance assignment is unfinished.
                            </span>
                          ):null}
                        </Table.Cell>
                        <Table.Cell>
                          <Button icon='folder open outline' fluid onClick={()=>{this.ViewMoreDetails(assignment.name, assignment.assessment, assignment.flac, assignment.transcribedText)}}/>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Button icon='delete' fluid color='red' onClick={()=>{this.handleDelete(assignment.assignmentId, assignment.email)}}/>
                          </Table.Cell>
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
        <Modal open={more_details} onClose={this.resetModal} closeIcon>
          <Modal.Header>
            <Segment vertical style={{padding: '0px'}}>
            {magnify_student}
            </Segment>
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>Assessment: {magnify_assessmentID}</Header>
              <p>{magnify_flac}</p>
              <p><strong>Transcribed Text</strong></p>
              <p>{magnify_transcribedText}</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Segment>
    )
  }
});