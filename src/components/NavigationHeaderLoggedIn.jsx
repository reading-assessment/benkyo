import React from 'react';
import { Container, Segment, Menu, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetMainRole, LogOut, StudentLogOut, TeacherLogOut } from './AuthenticateActions'

export default connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role,
  }
})(
class NavigationHeaderLoggedIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.LogOut = this.LogOut.bind(this);
  }

  changeTeacherDashboard(){
    console.log("click!")
  }


  LogOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      this.props.dispatch(LogOut());
      this.props.dispatch(StudentLogOut());
      this.props.dispatch(TeacherLogOut());
    }.bind(this)).catch(function(error) {
      // An error happened.
    });
  }

  render(){
    const {user_cred, role} = this.props;
    // if there is a uid (user logged in?)
    if (user_cred.uid){
      if (role === 'Teacher') {
        var renderImportClassRoom = (
          <Dropdown.Item>
            <a target='_blank' href={`${window.s_mode.base_url}/teacher/getToken?uid=${user_cred.uid}`}>Import Google Classroom</a>
          </Dropdown.Item>
        )
      }
      var renderLogout = (
        <Dropdown.Item onClick={this.LogOut}>
          Log Out
        </Dropdown.Item>
      )
    }
    return (
      <Menu fixed='top' size="large">
        <Container>
          stuff here
          <Menu.Menu position='right'>
            <Dropdown item icon='user circle outline' simple>
              <Dropdown.Menu>
                <Dropdown.Item>Hi{(user_cred.uid)?` ${user_cred.displayName}`:`, Please Login`}</Dropdown.Item>
                {renderImportClassRoom}
                {renderLogout}
              </Dropdown.Menu>

            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
})