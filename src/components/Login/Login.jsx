import { Button, Form, Header, Message, Grid, Segment } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux';
import { SetAuthenticatedUID } from './LoginActions'

@connect((store) => {
  return {
    uid: store.authentication.uid
  }
})

class Login extends React.Component {
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
      console.log(token);
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      // ...
    }).catch(function(error) {
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
    const{ uid } = this.props;
    return (
      <div style={{ paddingTop: '5em' }}>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header size='huge' color='violet' textAlign='center'>
              Login into Benkyo
            </Header>
            <Form size='large'>
              <Button color='teal' fluid size='large' onClick={this.LoginWithGoogle}>Login</Button>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
};

window.Login = Login;