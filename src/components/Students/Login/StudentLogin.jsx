import React from 'react';
import { Button, Form, Header, Message, Grid, Segment } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux';
import { SetAuthenticatedUID } from './StudentLoginActions'
import { SetMainRole, SetUserCred } from '../../AuthenticateActions'

export default connect((store) => {
  return {
    uid: store.authentication.uid
  }
})(
class StudentLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.LoginWithGoogle = this.LoginWithGoogle.bind(this);
  }

  LoginWithGoogle () {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('https://www.googleapis.com/auth/plus.me');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      firebase.database().ref(`roles/${user.uid}`).once('value').then(function(snapshot){
        if (!snapshot.val()){
          firebase.database().ref(`roles/${user.uid}`).update({primary:'Student'})
        }
      })
      this.props.dispatch(SetMainRole('Student'));
      this.props.resetAuthState(true);
      // ...
    }.bind(this)).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  render(){
    // what is this line doing?
    const{ uid } = this.props;
    return (
      <div style={{ paddingTop: '5em' }}>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header size='huge' color='green' textAlign='center'>
              Student Login into Benkyo
            </Header>
            <Form size='large'>
              <Button color='black' fluid size='large' onClick={this.LoginWithGoogle}>Login</Button>
            </Form>
            <Message>
              Not a Student?
              <br/>
              <a href='#' onClick={()=>{this.props.dispatch(SetMainRole('Teacher'))}}>Click Here</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
});