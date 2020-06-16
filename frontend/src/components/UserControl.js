import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';

const UserControl = (props) => {

console.log(props)
    
    return (
      <>
        <Container fluid>
            <Button variant="primary" onClick={props.endTurn} disabled={(props.player) ? !props.player.isTurn : true}>
                End Turn
            </Button>
            <Button variant="primary" onClick={props.newGame} disabled={(props.player) ? !props.player.isTurn : true}>
                New Game
            </Button>
        </Container>
      </>
    )
}

export default UserControl