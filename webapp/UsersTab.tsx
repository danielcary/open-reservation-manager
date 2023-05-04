import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type ManageUserPaneState = {
    users: { id: number, name: string }[];
}

class ManageUserPane extends React.Component<any, ManageUserPaneState> {

    constructor(props: any) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentDidMount(): void {
        axios.get('/api/users', {
            auth: {
                username: "admin",
                password: "password",
            }
        }).then(res => {
            this.setState({ users: res.data });
        });
    }

    deleteUser(id: number, name: string): void {
        if (confirm(`You sure you want to delete '${name}'`)) {
            axios.delete(`/api/users/${id}`, {
                auth: {
                    username: "admin",
                    password: "password",
                }
            }).then(() => {

            });
        }
    }

    render(): React.ReactNode {
        return <ListGroup>
            {this.state.users.map((val, idx) => (
                <ListGroup.Item key={idx}>
                    <Stack direction='horizontal' gap={3}>
                        <div>{val.name}</div>
                        <div className='ms-auto'><Button>Change Password</Button></div>
                        <div>
                            <Button
                                variant='danger'
                                onClick={() => this.deleteUser(val.id, val.name)}>
                                Delete
                            </Button>
                        </div>
                    </Stack>
                </ListGroup.Item>
            ))}
        </ListGroup>
    }

}

class AddUserPane extends React.Component {

    render(): React.ReactNode {
        return <Form onSubmit={e => {
            e.preventDefault();

            let nameElement = document.getElementById("formAddUserName") as HTMLInputElement;
            let passElement = document.getElementById("formAddUserPass") as HTMLInputElement;



            axios.post('/api/users', {
                name: nameElement.value,
                pass: passElement.value,
            }, {
                auth: {
                    username: "admin",
                    password: "password",
                }
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            })

            console.log("yoo")
        }}>
            <h4>Add User</h4>
            <Form.Group className="mb-3" controlId="formAddUserName">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddUserPass">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    }

}

export default class UsersTab extends React.Component {


    render(): React.ReactNode {
        return <Container fluid>
            <Row><br /></Row>
            <Row>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Manage Users</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Add User</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <ManageUserPane />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <AddUserPane />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Row>
        </Container>
    }
}
