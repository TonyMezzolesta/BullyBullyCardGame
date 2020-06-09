const endTurn = async (socket, players) => {
    //add 1 to the index of current turn, if it doesnt exist, start index over
    if(!players[(players.findIndex(x => x.sessionID === socket.id)) + 1]){
        players[players.findIndex(x => x.sessionID === socket.id)].isTurn = false;
        players[0].isTurn = true;
      }
      else{
        players[players.findIndex(x => x.sessionID === socket.id)].isTurn = false;
        players[(players.findIndex(x => x.sessionID === socket.id)) + 1].isTurn = true;
      }
}

module.exports = Object.values({}, { endTurn });