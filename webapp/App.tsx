import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import 'bootstrap/dist/css/bootstrap.min.css';

import LoginComponent from './Login';
import EventTab from './EventTab';
import UsersTab from './UsersTab';
import Button from 'react-bootstrap/esm/Button';


type AppState = {
    auth?: { username: string, password: string };
};

class App extends React.Component<any, AppState> {

    constructor(props: any) {
        super(props);

        this.state = {
            auth: undefined
        };
    }

    isAdminUser = (): boolean => {
        if (this.state.auth) {
            return this.state.auth.username == "admin";
        } else {
            return false;
        }
    }

    render(): React.ReactNode {
        return <Container fluid>
            <Navbar>
                <Navbar.Brand>Open RSVP Manager</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {this.state.auth &&
                        <Navbar.Text>
                            Signed in as: <strong>{this.state.auth.username}</strong>
                            , <a
                                href="#"
                                onClick={() => { this.setState({ auth: undefined }) }}>
                                Logout
                            </a>
                        </Navbar.Text>
                    }
                </Navbar.Collapse>
            </Navbar>

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
                    <Tab eventKey="users" disabled={!this.isAdminUser()} title='Users'>
                        <br />
                        {this.isAdminUser() && <UsersTab axiosConfig={{ auth: this.state.auth }} />}
                    </Tab>
                </Tabs>
            }
        </Container>
    }

}


document.body.innerHTML = "<div id='react-app'></div>";

const reactElement = document.getElementById('react-app') as Element;
createRoot(reactElement).render(<React.StrictMode><App /></React.StrictMode>);
