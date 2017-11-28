import { Container, Segment, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import {SetCurrentProfile, SetCurrentClasses} from './StudentActions'

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    profile: store.student.profile,
    enrolledClasses: store.student.enrolledClasses
  }
})


class StudentDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
    const{user_cred} = this.props;
    firebase.database().ref(`student/${user_cred.uid}`).once('value').then(function(snapshot){
      if (snapshot.val()){
        this.props.dispatch(SetCurrentProfile(snapshot.val().meta));
        this.props.dispatch(SetCurrentClasses(snapshot.val().classes));
      }
    }.bind(this))
  }

  render() {
    const {profile, user_cred, enrolledClasses} = this.props;

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

        <Segment color='teal'>
          <AssessmentRecording/>
        </Segment>
      </Segment>
    )
  }
}

window.StudentDashboard = StudentDashboard;