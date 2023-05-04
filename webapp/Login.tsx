import * as React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type LoginComponentProps = {
    onAuth: (user: string, pass: string) => void;
}

type LoginComponentState = {
    failed: boolean;
};


export default class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {

    constructor(props: LoginComponentProps) {
        super(props);

        this.state = {
            failed: false,
        };
    }

    submitCreds = (e: React.FormEvent): void => {
        e.preventDefault();

        let userElement = document.getElementById("formUsername") as HTMLInputElement;
        let passElement = document.getElementById("formPassword") as HTMLInputElement;

        let config: AxiosRequestConfig = {
            auth: {
                username: userElement.value,
                password: passElement.value,
            }
        };

        axios.get('/login', config).then(res => {
            this.props.onAuth(config.auth!.username, config.auth!.password);
        }).catch((err: AxiosError) => {
            if (err.status != 401) {
                // shouldn't normally see a non-401
                console.error(err);
            }
            this.setState({ failed: true });
        });
    }

    render(): React.ReactNode {
        return <Modal show={true} backdrop="static">
            <Modal.Body>
                {this.state.failed && <Alert variant='danger'>
                    Failed to login, bad credentials?
                </Alert>}
                <Form onSubmit={this.submitCreds}>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    }
}
