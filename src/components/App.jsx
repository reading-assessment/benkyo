import { Container, Segment, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import {SetMainView, SetUserCred, SetMainRole} from './AuthenticateActions'

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
            this.props.dispatch(SetMainRole(snapshot.val().primary));
          }
        }.bind(this))
        this.props.dispatch(SetMainView('Landing Page'));
        this.props.dispatch(SetUserCred(user));
      } else {
        this.props.dispatch(SetMainView('Login'));
        this.props.dispatch(SetMainRole('Student'));
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
            <AssessmentRecording/>
          </div>
        )
      } else {
        var renderLogin = (
          <VerifyRole/>
        )
      }
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