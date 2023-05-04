import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
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

interface User {
    id: number;
    name: string;
};

type UsersTabProps = {
    axiosConfig: AxiosRequestConfig
}

type UsersTabState = {
    users: User[];
};

type AddUserPaneProps = {
    addUser: (name: string, pass: string, cb: (err?: string) => void) => void;
};

type AddUserPaneState = {
    error?: string;
};

type ManageUserPaneProps = {
    users: User[];
    deleteUser: (user: User) => void;
};

class ManageUserPane extends React.Component<ManageUserPaneProps, any> {

    render(): React.ReactNode {
        return <ListGroup>
            {this.props.users.map((val, idx) => (
                <ListGroup.Item key={idx}>
                    <Stack direction='horizontal' gap={3}>
                        <div>{val.name}</div>
                        <div className='ms-auto'>
                            <Button
                                variant='danger'
                                onClick={() => this.props.deleteUser(val)}>
                                Delete
                            </Button>
                        </div>
                    </Stack>
                </ListGroup.Item>
            ))}
        </ListGroup>
    }

}

class AddUserPane extends React.Component<AddUserPaneProps, AddUserPaneState> {

    constructor(props: AddUserPaneProps) {
        super(props);

        this.state = {
            error: undefined
        };
    }

    submitUser = (e: React.FormEvent): void => {
        e.preventDefault();

        let nameElement =
            document.getElementById("formAddUserName") as HTMLInputElement;
        let passElement =
            document.getElementById("formAddUserPass") as HTMLInputElement;

        this.props.addUser(nameElement.value, passElement.value, (err) => {
            if (err) {
                this.setState({ error: err });
            } else {
                nameElement.value = "";
                passElement.value = "";
                this.setState({ error: undefined });
            }
        });
    }

    render(): React.ReactNode {
        return <Form onSubmit={this.submitUser}>
            <h4>Add User</h4>
            {this.state.error && (
                <Alert
                    variant='danger' dismissible
                    onClose={() => this.setState({ error: undefined })}>
                    <Alert.Heading>Error adding user!</Alert.Heading>
                    {this.state.error}
                </Alert>
            )}
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

export default class UsersTab extends React.Component<UsersTabProps, UsersTabState> {

    constructor(props: UsersTabProps) {
        super(props);

        this.state = {
            users: []
        };
    }

    loadUsers = (): void => {
        axios.get('/api/users', this.props.axiosConfig).then(res => {
            this.setState({ users: res.data });
        });
    }

    addUser = (name: string, pass: string, cb: (error?: string) => void): void => {
        let data = {
            name: name,
            pass: pass,
        };

        axios.post('/api/users', data, this.props.axiosConfig).then(() => {
            this.loadUsers();
            cb();
        }).catch((err: AxiosError) => {
            cb(err.response!.data as string);
        });
    }

    deleteUser = (user: User): void => {
        if (confirm(`You sure you want to delete '${user.name}'`)) {
            axios.delete(`/api/users/${user.id}`, this.props.axiosConfig).then(() => {
                this.loadUsers();
            });
        }
    }

    componentDidMount(): void {
        this.loadUsers();
    }

    render(): React.ReactNode {
        return <Container fluid>
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
                                    <ManageUserPane users={this.state.users} deleteUser={this.deleteUser} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <AddUserPane addUser={this.addUser} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Row>
        </Container>
    }
}
