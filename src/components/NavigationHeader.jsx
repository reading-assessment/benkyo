import { Container, Segment, Menu, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SetMainRole } from './AuthenticateActions'

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role
  }
})

class NavigationHeader extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.LogOut = this.LogOut.bind(this);
  }

  LogOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  render(){
    const {user_cred, role} = this.props;

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
          <Dropdown item text={role}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>{this.props.dispatch(SetMainRole('Student'))}}>Student</Dropdown.Item>
              <Dropdown.Item onClick={()=>{this.props.dispatch(SetMainRole('Teacher'))}}>Teacher</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Menu position='right'>
            <Dropdown item icon='user circle outline' simple>
              <Dropdown.Menu>
                <Dropdown.Item>Hi{(user_cred.uid)?` ${user_cred.displayName}`:`, Please Login as ${role}`}</Dropdown.Item>
                {renderImportClassRoom}
                {renderLogout}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}

window.NavigationHeader = NavigationHeader;