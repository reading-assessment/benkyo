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
  }



  render(){
    const{ uid } = this.props;
    return (
      <Button onClick={()=>{this.props.dispatch(SetAuthenticatedUID('Reading Assessment'))}}>
        Change Fountas & Pinnel to Reading Assessment Once
      </Button>
    )
  }
};

window.Login = Login;