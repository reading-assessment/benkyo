import { Table, Checkbox, Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

const dummyData = [
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'},
  { studentName: 'Juan', rawScore: 54, studentReading: 'this is a reading', AssignedAssessment: 'Assessment P, Version 3'}
]

class TeacherDashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Student Name</Table.HeaderCell>
            <Table.HeaderCell>Raw Score</Table.HeaderCell>
            <Table.HeaderCell>Student Reading</Table.HeaderCell>
            <Table.HeaderCell>Assigned Assessment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {dummyData.map((performance)=>{
            return (
              <Table.Row>
                <Table.Cell collapsing>
                  <Checkbox slider />
                </Table.Cell>
                <Table.Cell>{performance.studentName}</Table.Cell>
                <Table.Cell>{performance.rawScore}</Table.Cell>
                <Table.Cell>{performance.studentReading}</Table.Cell>
                <Table.Cell>{performance.AssignedAssessment}</Table.Cell>
              </Table.Row>
            )
          })}

        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan='4'>
              <Button floated='right' icon labelPosition='left' primary size='small'>
                <Icon name='user' /> Add User
              </Button>
              <Button size='small'>Approve</Button>
              <Button disabled size='small'>Approve All</Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }
}

window.TeacherDashboard = TeacherDashboard;