import { Container, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

@connect((store) => {
  return {
    uid: store.authentication.uid
  }
})

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { uid } = this.props;

    return (
      <Container>
        <Segment textAlign='center'>
          <Dashboard/>
          <br/>
          {uid}
        </Segment>
      </Container>
    )
  }
}

window.App = App;