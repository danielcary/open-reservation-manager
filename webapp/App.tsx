import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Container, Row, Col, Form, Button, } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import axios, { AxiosRequestConfig } from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import LoginComponent from './Login';
import EventTab from './EventTab';
import UsersTab from './UsersTab';

let reqConfig: AxiosRequestConfig = {
    auth: {
        username: "admin",
        password: "password",
    }
}

type AppState = {
    auth?: { username: string, password: string };
};

class App extends React.Component<any, AppState> {

    constructor(props: any) {
        super(props);

        this.state = {
            auth: {
                username: "admin",
                password: "password",
            }
        };
    }

    render(): React.ReactNode {
        return <Container fluid>
            {!this.state.auth &&
                <LoginComponent
                    onAuth={(user, pass) => {
                        this.setState({
                            auth: { username: user, password: pass }
                        });
                    }}
                />
            }
            {this.state.auth &&
                <Tabs defaultActiveKey="events">
                    <Tab eventKey="events" title='Events'>
                        <EventTab />
                    </Tab>
                    <Tab eventKey="settings" disabled title='Settings' />
                    <Tab eventKey="users" title='Users'>
                        <UsersTab />
                    </Tab>
                </Tabs>
            }
        </Container>
    }

}


document.body.innerHTML = "<div id='react-app'></div>";

const reactElement = document.getElementById('react-app') as Element;
createRoot(reactElement).render(<React.StrictMode><App /></React.StrictMode>);
