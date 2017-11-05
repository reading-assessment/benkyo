import { Container, Segment, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view
  }
})

class NavigationHeader extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    const {user_cred} = this.props;
    return (
      <Menu fixed='top' size="large">
        <Container>
          <Menu.Item>
            <a target='_blank' href={`${window.s_mode.base_url}/teacher/getToken?uid=${user_cred.uid}`}>Import Google Classroom</a>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              Logged in as {user_cred.email}
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}

window.NavigationHeader = NavigationHeader;