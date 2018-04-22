import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, Dropdown, Container } from 'semantic-ui-react';


@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    live_assignments: store.teacher.live_assignments,
    all_assessments: store.teacher.all_assessments
  }
})


class Header extends Component {

  renderLink() {
      return [
        <Menu.Item key={1}>
          <Link to="/students">Students</Link>
        </Menu.Item>,
        <Menu.Item key={2}>
          <Link to="/assignments">Assignments</Link>
        </Menu.Item>,
        <Menu.Item key={3}>
          <Link to="/assessments">Assessment Pool</Link>
        </Menu.Item>
      ]
    }
  

  render() {
    return (
      <div>
      <Menu size="small">
        <Container>
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>
          {this.renderLink()}
        </Container>
      </Menu>
      </div>
    );
  }
}

export default Header;
