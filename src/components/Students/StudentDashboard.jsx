import React from 'react';
import { Container, Segment, Header, Table, Modal, Image, Item, Divider, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import htmlToText from 'html-to-text';
import axios from 'axios';
import {SetCurrentProfile, SetCurrentClasses, SetAllAssigments} from './StudentActions'
import Promise from 'bluebird';
import AssessmentRecording from './Recording/AssessmentRecording.jsx'

export default connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    profile: store.student.profile,
    enrolledClasses: store.student.enrolledClasses,
    all_assignments: store.student.all_assignments
  }
})(
class StudentDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current_course: null,
      current_assessment: null,
      current_assignment: null,
      current_assessment_text: null,
      current_assessment_image: null,
      open_assessment_modal: false
    }
    this.StartAssessment = this.StartAssessment.bind(this);
    this.CloseAssessment = this.CloseAssessment.bind(this);
  }

  componentDidMount(){
    const{user_cred} = this.props;

    return new Promise(function(resolve, reject){
      firebase.database().ref(`/student/${user_cred.uid}/assignment/`).once('value')
      .then(function(snapshot){
        snapshot.forEach(function(assignment){
          if (assignment.val().status === 'done') {
            firebase.database().ref(`assignment/${assignment.key}/results`).update(assignment.val());
          }
        })
        resolve();
      })
    })
    .then(function(){
      firebase.database().ref(`student/${user_cred.uid}`).once('value').then(function(snapshot){
        if (snapshot.val()){
          this.props.dispatch(SetCurrentProfile(snapshot.val().default_profile));
          this.props.dispatch(SetCurrentClasses(snapshot.val().classes));
          var classes = snapshot.val().classes;
          var ids = [];
          for (var single_class in classes) {
            ids.push(classes[single_class].id);
          }
          firebase.database().ref(`assignment`).once('value')
          .then(function(assignment_snap){
            var all_assignments = [];
            assignment_snap.forEach(function(each_assignment){
              if(ids.indexOf(each_assignment.val().studentID)>-1){
                var obj = each_assignment.val();
                obj.assignmentID = each_assignment.key;
                all_assignments.push(obj);
              }
            })
            this.props.dispatch(SetAllAssigments(all_assignments));
          }.bind(this))
        }
      }.bind(this));
    }.bind(this))
  }

  StartAssessment(course, assessment, assignment) {
    const {user_cred} = this.props;
    this.setState({
      current_course: course,
      current_assessment: assessment,
      current_assignment: assignment
    })
    firebase.database().ref(`assessments/${assessment}`).once('value').then(function(snapshot){
      if (snapshot.val()){
        var text = snapshot.val().Text.long;
        var image = snapshot.val().meta.image_url;
        this.setState({
          current_assessment_text: text,
          current_assessment_image: image,
          open_assessment_modal: true
        })
        firebase.database().ref(`student/${user_cred.uid}/assignment/${assignment}`).update({status:'initiated'})
        firebase.database().ref(`assignment/${assignment}/results`).update({status:'initiated'})
      }
    }.bind(this))
  }

  CloseAssessment(){
    this.setState({
      current_course: null,
      current_assessment: null,
      current_assignment: null,
      current_assessment_text: null,
      current_assessment_image: null,
      open_assessment_modal: false
    })
  }

  render() {
    const {profile, user_cred, enrolledClasses, all_assignments} = this.props;
    const {current_course, current_assignment, current_assessment, current_assessment_image, current_assessment_text, open_assessment_modal} = this.state;

    return (
      <Segment vertical>
        <Header as='h2'>
          Hi {(profile.name)?profile.name.givenName:null}!  Welcome to Benkyo Reading!
        </Header>
        <Header as='h4'>
          If any of your teachers have assigned you a reading assessment, please click 'Begin Assessment' to start your reading assessment.
          After you begin:
          <br/>
          <ol>
            <li>You'll be presented with a picture to show you the topic of the reading assessment with a timer for 10 seconds</li>
            <li>Once the timer ends, the reading passage will appear and please start reading when the text is shown</li>
            <li>Click stop assessment when you have finished reading</li>
            <li>Wait for the pretty color bar to be all green before you close your window</li>
          </ol>
          <br/>
          Good Luck!
        </Header>

        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Assignment</Table.HeaderCell>
              <Table.HeaderCell>Assessment</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {all_assignments.map(function(assignment, key){
              if (!assignment.results){
                var renderCTA = (
                  <Table.Cell textAlign='center'>
                    <Button color='green' fluid size='mini' onClick={()=>{this.StartAssessment(assignment.courseID, assignment.assessment, assignment.assignmentID)}}>Begin</Button>
                  </Table.Cell>
                )
              } else {
                if (assignment.results.status !== 'done'){
                  var renderCTA = (
                    <Table.Cell textAlign='center'>
                      <Button color='green' fluid size='mini' onClick={()=>{this.StartAssessment(assignment.courseID, assignment.assessment, assignment.assignmentID)}}>Begin</Button>
                    </Table.Cell>
                  )
                } else {
                  var renderCTA = (
                    <Table.Cell>
                      {assignment.results.status}
                    </Table.Cell>
                  )
                }
                if (assignment.results.scoreFromCompareWord){
                  var renderScore = new Number(assignment.results.scoreFromCompareWord*100).toFixed(0).toString() + '%';
                }
              }
              return(
                <Table.Row key={key}>
                  <Table.Cell>
                  <strong>{(assignment.descriptionHeading)?assignment.descriptionHeading:assignment.courseID}</strong>
                  <br/>
                  Assignment Id: {assignment.assignmentID}
                  </Table.Cell>
                  <Table.Cell>{assignment.assessment}</Table.Cell>
                  {renderCTA}
                  <Table.Cell>
                    {renderScore}
                  </Table.Cell>
                </Table.Row>
              )
            }.bind(this))}
          </Table.Body>
        </Table>
        <Modal size='fullscreen' open={open_assessment_modal} onClose={this.CloseAssessment} closeIcon>
          <Modal.Header>Course: {current_course}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>Assignment: {current_assignment}</Header>
              <Item.Group>
                <Item>
                  <Item.Image src={current_assessment_image} />
                  <Item.Content verticalAlign='middle'>
                    {htmlToText.fromString(current_assessment_text)}
                  </Item.Content>
                </Item>
              </Item.Group>
              <Divider />
              <AssessmentRecording classroomId={current_course} assessmentId={current_assessment} assignmentId={current_assignment}/>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Segment>
    )
  }
});