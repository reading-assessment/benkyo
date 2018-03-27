import React from 'react';
import { Table, Checkbox, Button, Icon, Segment, Grid, Divider, Modal, Header, Dimmer } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

import { SetListOfStudents, SetAllClassrooms, SetCurrentClassrooms, StoreAllAssessments, SetAllLiveAssignments } from './TeacherActions'

import Promise from 'bluebird';
import _ from 'lodash';
import AssignAssessment from './AssignAssessment.jsx'
import TeacherDashboard_Assignments from './TeacherDashboard_Assignments.jsx'
import TeacherDashboard_StudentRecords from './TeacherDashboard_StudentRecords.jsx'
import moment from 'moment'

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    live_assignments: store.teacher.live_assignments,
    all_assessments: store.teacher.all_assessments
  }
})


export default class TeacherDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showAssignmentPanel: true
    }
    this.changeDashboardView = this.changeDashboardView.bind(this);
  }

changeDashboardView(){
  this.setState({
    showAssignmentPanel: !this.state.showAssignmentPanel
  });
}

render(){
  const { showAssignmentPanel }  = this.state;

  return (
    <div>
      <button onClick={this.changeDashboardView}>Click to toggle View</button>
      {showAssignmentPanel ? <TeacherDashboard_Assignments /> : <TeacherDashboard_StudentRecords/>}
    </div>
  )
 }
}
