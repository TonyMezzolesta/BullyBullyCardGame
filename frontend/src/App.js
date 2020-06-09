import React, { useEffect, useState } from 'react';
import './App.css';
import {Container, Row, Col, Card, Form, Button} from 'react-bootstrap';
import UserControl from './components/UserControl';
const io = require('socket.io-client');
const socket = io();
var gameID = "XKI432";

const UserCard = (props) => {
  console.log(props);
  var playerName = (props.player) ? props.player.userName : "No Player";
  var currentAction = (props.player) ? props.player.currentAction : "No Actions"
  return <Card border="primary" style={{ width: '18rem' }}>
    <Card.Header>Title</Card.Header>
    <Card.Body>
    <Card.Title>{playerName}</Card.Title>
      <Card.Text>
        {currentAction}
      </Card.Text>
    </Card.Body>
  </Card>
}

function App() {
  let [user, setUser] = useState(null);
  let [connect, setConnect] = useState(false);
  let [players, setPlayers] = useState([]);


  useEffect(()=>{
    socket.on("newMessage", data => {
      console.log(data);
    });

    socket.on("new user join", data => {
      console.log('new user joined')
      console.log(data);
      
    });

    socket.on("gameInit", data => {
      console.log('game initialization')
      console.log(data);
      setPlayers(data.players);
    });

  }, []);

  function socketConnect(event){
    event.preventDefault();
    console.log('join game')
    socket.emit('joinGame', {gameID: gameID, userName: user});
    setConnect(true);
  }

  function getPlayer(players = [], cardPlayer){
    //player 1 is you, all other players are the opponents
    if(cardPlayer === "player1"){
      return players[players.findIndex(x => x.sessionID === socket.id)];
    }
    else{
      var otherPlayers = players.filter(x => x.sessionID !== socket.id);

      switch (cardPlayer){
        case "player2":
          return (otherPlayers[0]) ? otherPlayers[0] : null;
        case "player3":
          return (otherPlayers[1]) ? otherPlayers[1] : null;
        case "player4":
          return (otherPlayers[2]) ? otherPlayers[2] : null;
      }
    }
  }

  //user control functions
  function endTurn(){
    var action = {
      gameID: gameID,
      actionType: "endTurn",
      currentAction: "player ending turn"
    }

    socket.emit('playerAction', action);
  }

  return (
    <>
      {(connect) ?
        <Container fluid>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
            </Col>
            <Col md="auto"><UserCard player={getPlayer(players, "player3")}/></Col>
            <Col xs lg="2">
            </Col>
          </Row>
          <Row>
            <Col><UserCard player={getPlayer(players, "player2")}/></Col>
            <Col xs={6}></Col>
            <Col><UserCard player={getPlayer(players, "player4")}/></Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
            </Col>
            <Col md="auto"><UserCard player={getPlayer(players, "player1")}/></Col>
            <Col xs lg="2">
            </Col>
          </Row>
          <Row>
            <UserControl endTurn={endTurn} player={players[players.findIndex(x => x.sessionID === socket.id)]}/>
          </Row>
        </Container> :
        <Container fluid >
          <Row style={{height: "100vh", alignItems: "center"}}>
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="text-center" style={{overflow: "scroll", boxShadow: "3px 3px 5px 6px #ccc"}}>
              <Card.Header>Occupational Survey</Card.Header>
              <Card.Body>
                <Form onSubmit={socketConnect}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter A Name" value={user} onChange={(e) => setUser(e.target.value)}/>
                  </Form.Group>
                  <Button variant="primary" type="submit" >
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          </Row>
        </Container>     
      }
    </>
  );
}

export default App;
