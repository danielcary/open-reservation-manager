import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';



class ListEventPane extends React.Component {

    render(): React.ReactNode {
        return <ListGroup>

        </ListGroup>
    }

}

class CreateEventPane extends React.Component {

    render(): React.ReactNode {
        return (
            <Form>
                <h3>Create Event</h3>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Event Start Time</Form.Label>
                    <Form.Control type="datetime-local" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Event Notification Settings</Form.Label>
                    <Form.Check defaultChecked type="radio" name="noteType" label="RSVP" />
                    <Form.Check type="radio" name="noteType" label="Regrets Only" />
                    <Form.Check type="radio" name="noteType" label="Reminder Only" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check defaultChecked inline label="SMS Notifications" />
                    <Form.Check defaultChecked inline label="Email Notifications" />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicPas2sword">
                    <Form.Control type="number"
                        min={0} max={24 * 32} defaultValue={24} />
                    <Form.Text className="text-muted">
                        Hours before event start to send notifications
                    </Form.Text>
                </Form.Group>


                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }

}


export default class EventTab extends React.Component {


    render(): React.ReactNode {
        return <Container fluid>
            <Row><br /></Row>
            <Row>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">List Events</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Create Event</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <ListEventPane />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <CreateEventPane />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Row>
        </Container>
    }
}
