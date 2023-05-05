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
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';


interface Table {
    name: string;
    capacity: number;
}

type TablesTabProps = {
    axiosConfig: AxiosRequestConfig
};

type EditTableGroupingPaneProps = {
    id?: number;
    name?: string;
    desc?: string;
    tables?: Table[];
    onSubmitChanges: (id: number | undefined, name: string, desc: string, tables: Table[], cb: (err?: string) => void) => void;
};

type EditTableGroupingPaneState = {
    name: string;
    desc: string;
    tables: Table[];
    error?: string;
};

class EditTableGroupingPane extends React.Component<EditTableGroupingPaneProps, EditTableGroupingPaneState> {

    constructor(props: EditTableGroupingPaneProps) {
        super(props);

        this.state = {
            name: this.props.name || "",
            desc: this.props.desc || "",
            tables: this.props.tables || [],
            error: undefined,
        };
    }

    submitChanges = (e: React.FormEvent): void => {
        e.preventDefault();

        // TODO?: validation

        this.props.onSubmitChanges(this.props.id, this.state.name,
            this.state.desc, this.state.tables, (err) => {
                if (err) {
                    this.setState({ error: err });
                } else {
                    // only clear when adding a new grouping, not editing
                    if (!this.props.id) {
                        this.setState({
                            name: "", desc: "", tables: [], error: undefined
                        });
                    }
                }
            }
        );
    }

    render(): React.ReactNode {
        return (
            <Form onSubmit={this.submitChanges}>
                <h3>Create Table Grouping</h3>
                {this.state.error && (
                    <Alert
                        variant='danger' dismissible
                        onClose={() => this.setState({ error: undefined })}>
                        <Alert.Heading>Error adding grouping!</Alert.Heading>
                        {this.state.error}
                    </Alert>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Grouping Name</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter name"
                        value={this.state.name}
                        onChange={e => { this.setState({ name: e.target.value }); }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Grouping Description</Form.Label>
                    <Form.Control as="textarea"
                        placeholder='Enter optional desc or info'
                        value={this.state.desc}
                        onChange={e => { this.setState({ desc: e.target.value }); }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tables</Form.Label>
                    <Form.Text>
                        <Button onClick={() => {
                            let tables = this.state.tables;
                            tables.push({
                                name: `Table ${tables.length + 1}`,
                                capacity: 1,
                            });
                            this.setState({ tables: tables });
                        }} variant="outline-success">+
                        </Button>
                    </Form.Text>
                    <ListGroup variant='flush'>
                        {this.state.tables.map((val, idx) => (
                            <ListGroup.Item key={idx}>
                                <InputGroup>
                                    <FloatingLabel label="table name">
                                        <Form.Control type="text"
                                            onChange={e => {
                                                this.state.tables[idx].name = e.target.value;
                                                this.setState({ tables: this.state.tables });
                                            }}
                                            placeholder='table name'
                                            value={val.name}
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="table capacity">
                                        <Form.Control type="number" max={999} min={0}
                                            onChange={e => {
                                                try {
                                                    let val = parseInt(e.target.value);
                                                    this.state.tables[idx].capacity = val;
                                                } catch {
                                                    this.state.tables[idx].capacity = 0;
                                                } finally {
                                                    this.setState({ tables: this.state.tables });
                                                }
                                            }}
                                            value={val.capacity}
                                        />
                                    </FloatingLabel>
                                    <Button onClick={() => {
                                        let tables = this.state.tables;
                                        tables.splice(idx, 1);
                                        this.setState({ tables: tables });
                                    }} variant="outline-danger">X
                                    </Button>
                                </InputGroup>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Form.Group>

                <Button type="submit">
                    Add
                </Button>
            </Form>
        );
    }

}

export default class TablesTab extends React.Component<TablesTabProps, any> {

    constructor(props: TablesTabProps) {
        super(props);
    }

    saveTableGrouping = (id: number | undefined, name: string, desc: string,
                         tables: Table[], cb: (err?: string) => void) => {
        
        
    }

    render(): React.ReactNode {
        return <Container fluid>
            <Row>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">List Table Groups</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">Add Table Grouping</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <EditTableGroupingPane onSubmitChanges={this.saveTableGrouping} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Row>
        </Container>
    }

}