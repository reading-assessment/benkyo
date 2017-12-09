import { Header, Button, Icon, Segment, Grid, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { SetMainView, SetMainRole } from '../AuthenticateActions'
/* 
@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role
  }
})
 */
class VerifyRole extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.setPrimaryRole = this.setPrimaryRole.bind(this);
  }

  setPrimaryRole(role){
    const {user_cred} = this.props;
    var roleKey = {
      1: 'Teacher',
      2: 'Student'
    }
    console.log(user_cred)
    firebase.database().ref(`roles/${user_cred.uid}`).update({primary: roleKey[role]});
    this.props.dispatch(SetMainRole(roleKey[role]));
    this.props.dispatch(SetMainView('Landing Page'));
  }

  render(){
    return (
      <Segment vertical textAlign='center'>
        <Message error>
          Your account has not been assigned a primary role
        </Message>
        <Header as='h2'>Are you a teacher or a student?</Header>
        <Button.Group fluid>
          <Button color='blue' onClick={()=>{this.setPrimaryRole(1)}}>Teacher</Button>
          <Button.Or />
          <Button color='green' onClick={()=>{this.setPrimaryRole(2)}}>Student</Button>
        </Button.Group>
      </Segment>
    )
  }
}

window.VerifyRole = connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    change_main_view: store.authentication.change_main_view,
    role: store.authentication.role
  }
})(VerifyRole);


// window.VerifyRole = VerifyRole;


