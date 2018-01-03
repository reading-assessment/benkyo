import React from 'react';
import { Container, Segment, Menu, Dimmer, Loader, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import {SetMainView, SetUserCred, SetMainRole, SetClassInfo} from './AuthenticateActions'

import NavigationHeader from './NavigationHeader.jsx'
import TeacherLogin from './Teachers/Login/TeacherLogin.jsx'
import TeacherDashboard from './Teachers/TeacherDashboard.jsx'
import StudentLogin from './Students/Login/StudentLogin.jsx'
import StudentDashboard from './Students/StudentDashboard.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      change_main_view: null
    }
    this.setAuthState = this.setAuthState.bind(this);
  }

  componentDidMount(){
    this.setAuthState();
  }

  setAuthState() {
    // we get access to the firebase object because it is reffered in index.html
    // if the state of the authentication changes
    firebase.auth().onAuthStateChanged(function(user) {
      // if a user is signed in
      if (user){
        // get from the user.uid which is the firebase reference to the user its role from the
        // roles node of the database
        firebase.database().ref(`roles/${user.uid}`).once('value').then(function(snapshot){
          if (snapshot.val()){
            // get the "primary" key from the uid node
            if (snapshot.val().primary) {
              // set the APP state "role" to values of "primary" key in firebase
              // (Student or Teacher)
              this.props.dispatch(SetMainRole(snapshot.val().primary));
            } else {
              // if the primary role has not been set, set the APP state role to "Select_Role"
              this.props.dispatch(SetMainRole('Select_Role'))
            }
            // if the primary role is student, as we get it from firebase
            if (snapshot.val().primary === 'Student'){
              // go to the "classes" node, get all the classes
              firebase.database().ref(`classes`).once('value').then(function(snapshot){
                // a variable to update the student default profile
                var lastProfile = null;
                // forEach is a firebase function that loops through all the keys in snapshot
                // loop through all the classes
                snapshot.forEach(function(classroom){
                  // each class has a students node which refer to the classroom's students by id OF THE GOOGLE CLASSROOM
                  var students = classroom.val().students;
                  // loops through all the students in the class (ids)
                  for (var id in students){
                    // if the profile.emailAddress of the student in the class matches the
                    // logged in user e-mail
                    if (students[id].profile.emailAddress === user.email){
                      var newClass = {};
                      // store the profile of the student to the newClass object
                      newClass[students[id].courseId] = students[id].profile;
                      // update the profile of the student in the student node
                      firebase.database().ref(`student/${user.uid}/classes`).update(newClass);
                      lastProfile = students[id].profile;
                    }
                  }
                })
                // update the default profile of student in the sudent node
                // from the profile taken from the classes -> students node
                firebase.database().ref(`student/${user.uid}/default_profile`).update(lastProfile);
              })
            }
          }
        }.bind(this))
        // set the APP state of change_main_view to "Landing Page"
        this.props.dispatch(SetMainView('Landing Page'));
        // set the APP state of user_cred to user
        this.props.dispatch(SetUserCred(user));
      } else {
        // if no user is signed in
        // set the APP role state to Student
        this.props.dispatch(SetMainRole('Student'));
        // set the APP state of change_main_view to "Login"
        this.props.dispatch(SetMainView('Login'));
      }
    }.bind(this));
  }

  render() {
    // get values from the APP state
    const { user_cred, change_main_view, role } = this.props;
    // if no user is signed in
    if (change_main_view === 'Login') {
      if (role === 'Teacher'){
        var renderLogin = (
          <TeacherLogin/>
        )
      } else if (role === 'Student') {
        var renderLogin = (
          <StudentLogin/>
        )
      }
    } else if (change_main_view === 'Landing Page') {
      // if the user is signed in as Teacher
      if (role === 'Teacher'){
        var renderLogin = (
          <TeacherDashboard/>
        )
      } else if (role === 'Student') {
        // if the user is signed in as Student
        var renderLogin = (
          <div>
            <StudentDashboard/>
          </div>
        )
      } else if (role === 'Select_Role') {
        // if user is logen in but primary role has not been set in firebase
        var renderLogin = (
          <VerifyRole/>
        )
        // show loader
      } else {
        var renderLogin = (
          <Segment>
            <Dimmer active>
              <Loader />
            </Dimmer>
            <Image src='https://firebasestorage.googleapis.com/v0/b/benkyohr-e00dc.appspot.com/o/elements%2Fshort-paragraph.png?alt=media&token=3b02b482-c6b7-42a6-ad03-c66c0a8f94b3' />
          </Segment>
        )
      }
      // show loader while autheticating
    } else if (change_main_view === 'Authenticating'){
      var renderLogin = (
        <Segment>
          <Dimmer active>
            <Loader />
          </Dimmer>
          <Image src='https://firebasestorage.googleapis.com/v0/b/benkyohr-e00dc.appspot.com/o/elements%2Fshort-paragraph.png?alt=media&token=3b02b482-c6b7-42a6-ad03-c66c0a8f94b3' />
        </Segment>
      )
    }

    return (
      <div>
        <NavigationHeader />
        <Container style={{marginTop: '70px'}}>
          {renderLogin}
        </Container>
      </div>
    )
  }
}


window.App = connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role
  }
})(App);
