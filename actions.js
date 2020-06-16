var _ = require("lodash");

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

const newGame = async (socket, players, bullyCards, mainCards) => {
  //shuffle new cards and set order
  mainCards = _.shuffle(mainCards);

  //shuffle bully cards
  bullyCards = _.shuffle(bullyCards);
}

module.exports = Object.assign({}, { endTurn, newGame });