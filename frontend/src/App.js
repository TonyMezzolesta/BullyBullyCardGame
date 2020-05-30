import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client';
import {Container, Row, Col, Card, Form, Button} from 'react-bootstrap';

function UserCard(){
  return <Card border="primary" style={{ width: '18rem' }}>
    <Card.Header>Header</Card.Header>
    <Card.Body>
      <Card.Title>Primary Card Title</Card.Title>
      <Card.Text>
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </Card.Text>
    </Card.Body>
  </Card>
}

function App() {
  let [user, setUser] = useState(null);
  let [connect, setConnect] = useState(false);
  const socket = socketIOClient('', {query: {user_id: user, token: null}});

  useEffect(()=>{
    socket.on("notification", data => {
      console.log(data);
    });
  }, []);

  function socketConnect(event){
    event.preventDefault();
console.log('socket connect')
    socket.on('connect', () => {
      console.log(socket.id);
      
    });
  }

  return (
    <>
      {(connect) ?
        <Container>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
            </Col>
            <Col md="auto"><UserCard /></Col>
            <Col xs lg="2">
            </Col>
          </Row>
          <Row>
            <Col><UserCard /></Col>
            <Col xs={6}></Col>
            <Col><UserCard /></Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
            </Col>
            <Col md="auto"><UserCard /></Col>
            <Col xs lg="2">
            </Col>
          </Row>
          <Row>

          </Row>
        </Container> :
        <Form onSubmit={socketConnect}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" placeholder="Enter A Name" value={user} onChange={(e) => setUser(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>     
      }
    </>
  );
}

export default App;
