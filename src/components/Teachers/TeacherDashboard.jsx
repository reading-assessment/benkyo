import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Table, Checkbox, Button, Icon, Segment, Grid, Divider, Modal, Header, Dimmer } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import Promise from 'bluebird';
import _ from 'lodash';
import AssignAssessment from './AssignAssessment.jsx'

import TeacherDashboardHeader from './TeacherDashboard_Header.jsx'
import TeacherDashboardAssignments from './TeacherDashboard_Assignments.jsx'
import TeacherDashboardStudents from './TeacherDashboard_StudentRecords.jsx'
import TeacherDashboardAssessments from './TeacherDashboard_Assessments.jsx'
import TeacherDashboardHome from './TeacherDashboard_Home.jsx'
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
    <BrowserRouter>
      <div>
      <TeacherDashboardHeader/>
      <Switch>
          <Route exact path="/" component={TeacherDashboardHome} />
          <Route path="/students" component={TeacherDashboardStudents} />
          <Route path="/assignments" component={TeacherDashboardAssignments} />
          <Route path="/assessments" component={TeacherDashboardAssessments} />
      </Switch>



      </div>
    </BrowserRouter>
  )
 }
}
