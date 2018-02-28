import React from 'react';
import { Segment, Header, Card, Dropdown, Button, Image, Item } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import htmlToText from 'html-to-text';
import { SelectAssessment, AssignItinStone } from './TeacherActions'

export default connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    current_target_student: store.teacher.current_target_student,
    all_assessments: store.teacher.all_assessments,
    selected_assessment: store.teacher.selected_assessment,
    done_selecting: store.teacher.done_selecting
  }
})(
  class AssignAssessment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      }
      this.selectAssessment = this.selectAssessment.bind(this);
      this.AssignItinStone = this.AssignItinStone.bind(this);
    }

    selectAssessment(e, { value }) {
      this.props.dispatch(SelectAssessment(value));
    }

    AssignItinStone() {
      const { current_target_student, selected_assessment } = this.props;
      var obj = {
        studentID: current_target_student.userId,
        studentInfo: current_target_student.profile,
        courseID: current_target_student.courseId,
        assessment: '-' + selected_assessment,
        descriptionHeading: current_target_student.descriptionHeading //Name of the Class
      };
      firebase.database().ref(`assignment`).push(obj);
      this.props.dispatch(AssignItinStone());
    }

    render() {
      const { selected_assessment, done_selecting, current_target_student, all_assessments } = this.props;

      if (current_target_student) {
        var assessmentDropDown = [];

        if (all_assessments) {
          for (var assessment in all_assessments) {
            if (all_assessments[assessment].meta.id) {
              var obj = {
                text: `${all_assessments[assessment].meta.id} - ${all_assessments[assessment].meta.title}`,
                value: all_assessments[assessment].meta.id,
                key: assessment
              }
              assessmentDropDown.push(obj);
            }
          }
        }

        if (selected_assessment) {
          var renderAssessmentText = (
            <Card.Content extra>
              <Card.Description>
                <Item.Group>
                  <Item>
                    <Item.Image src={all_assessments['-' + selected_assessment].meta.image_url} />
                    <Item.Content verticalAlign='middle'>{htmlToText.fromString(all_assessments['-' + selected_assessment].Text.long)}</Item.Content>
                  </Item>
                </Item.Group>
              </Card.Description>
            </Card.Content>
          )
          if (!done_selecting) {
            var renderConfirmButton = (
              <Card.Content extra>
                <Button basic color='green' fluid onClick={this.AssignItinStone}>Confirm</Button>
              </Card.Content>
            )
          } else {
            var renderConfirmButton = (
              <Card.Content extra>
                <Button basic color='green' disabled fluid>Assessment Assigned!</Button>
              </Card.Content>
            )
          }
        }

        var renderAssignment = (
          <Card fluid>
            <Card.Content>
              <Image floated='right' size='mini' src={current_target_student.profile.photoUrl} />
              <Card.Header>
                {current_target_student.profile.name.fullName}
              </Card.Header>
              <Card.Meta>
                {current_target_student.profile.emailAddress}
              </Card.Meta>
              <Card.Description>
                Assign an assessment
                {' '}
                <Dropdown inline options={assessmentDropDown} placeholder='Please Select' onChange={this.selectAssessment} />
              </Card.Description>
            </Card.Content>
            {renderAssessmentText}
            {renderConfirmButton}
          </Card>
        )
      } else {
        var renderAssignment = (
          <Header as='h3'>
            Click One of the Students to the Right to Assign an Assessment'
        </Header>
        )
      }
      return (
        <Segment vertical style={{ paddingTop: '0px' }}>
          {renderAssignment}
        </Segment>
      )
    }
  });