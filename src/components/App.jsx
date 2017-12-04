import { Container, Segment, Menu, Dimmer, Loader, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import {SetMainView, SetUserCred, SetMainRole, SetClassInfo} from './AuthenticateActions'

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role
  }
})

class App extends React.Component {
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
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        firebase.database().ref(`roles/${user.uid}`).once('value').then(function(snapshot){
          if (snapshot.val()){
            if (snapshot.val().primary) {
              this.props.dispatch(SetMainRole(snapshot.val().primary));
            } else {
              this.props.dispatch(SetMainRole('Select_Role'))
            }
            if (snapshot.val().primary === 'Student'){
              firebase.database().ref(`classes`).once('value').then(function(snapshot){
                var lastProfile = null;
                snapshot.forEach(function(classroom){
                  var students = classroom.val().students;
                  for (var id in students){
                    if (students[id].profile.emailAddress === user.email){
                      var newClass = {};
                      newClass[students[id].courseId] = students[id].profile;
                      firebase.database().ref(`student/${user.uid}/classes`).update(newClass);
                      lastProfile = students[id].profile;
                    }
                  }
                })
                firebase.database().ref(`student/${user.uid}/default_profile`).update(lastProfile);
              })
            }
          }
        }.bind(this))
        this.props.dispatch(SetMainView('Landing Page'));
        this.props.dispatch(SetUserCred(user));
      } else {
        this.props.dispatch(SetMainRole('Student'));
        this.props.dispatch(SetMainView('Login'));
      }
    }.bind(this));
  }

  render() {
    const { user_cred, change_main_view, role } = this.props;

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
      if (role === 'Teacher'){
        var renderLogin = (
          <TeacherDashboard/>
        )
      } else if (role === 'Student') {
        var renderLogin = (
          <div>
            <StudentDashboard/>
          </div>
        )
      } else if (role === 'Select_Role') {
        var renderLogin = (
          <VerifyRole/>
        )
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

window.App = App;