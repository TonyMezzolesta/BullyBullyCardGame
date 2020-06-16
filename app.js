const express = require("express");
const app = express();
const path = require('path');
const { endTurn, newGame } = require('./actions');
const { bullyCards } = require('./cards/bullyCards');
const { mainCards } = require('./cards/mainCards');
// const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
// var cookieParser = require('cookie-parser');
var _ = require("lodash");
//const { verifyJwtToken, isAuthenticatedService } = require("./authentication");


// //global mongo connection
// mongoose.connect(process.env.MONGO_CONNECTION, {
//     useNewUrlParser: true,
//     useFindAndModify: false
// });
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;

//swagger info
// var swaggerUi = require('swagger-ui-express'),
//     swaggerDocument = require('./config/swagger.json');

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api/v1', userRouter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

//cors policy
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  exposedHeaders: 'Content-Disposition'
}
app.use(cors(corsOptions));
//app.use(cors());

//cookies
//app.use(cookieParser())

// set the db to pass through the routes
app.use((req, res, next) => {
  res.locals.mongoDB = db;
  next();
});

//log api call
app.use((req, res, next) => {
  // res.on("finish", function(req, res, next) {
  //   log.saveApiLog(req, res);
  //   next();
  // });
  log.saveApiLog(req, res);
  next();
});

//socket connections
var players = []

io.sockets.use(async function(socket, next){
//   if (socket.handshake.query && socket.handshake.query.token){
//     const tokenObj = await verifyJwtToken(socket.handshake.query.token);
//     if(!tokenObj){
//       console.log('socket not authorized')
//       return next(new Error('Not Authorized'))
//     }
    
//     next();
//   } else {
//     console.log('socket missing parms')
//       next(new Error('Authentication error'));
//   }    
next();
})
.on('connection', function(socket) {
  console.log('connected')

  //routes
  socket.on('newMessage', function(data){
    console.log('***********************send message: ')
    console.log(data)
    if(data){
      //data.user_id
    }
  })

  socket.on('joinGame', function(data){
    console.log(data);
    socket.join(data.gameID);
    var newPlayer = {sessionID: socket.id, userName: data.userName, currentAction: null, isTurn: false};
    players.push(newPlayer);
    socket.broadcast.to(data.gameID).emit('newUser', `${data.userName} has entered the game`);
    //check to see if player is first in array, if so, make it their turn
    console.log(players.findIndex(x => x.sessionID === socket.id))
    if(players.findIndex(x => x.sessionID === socket.id) === 0){
      players[players.findIndex(x => x.sessionID === socket.id)].isTurn = true;
    }
    //nsp will broadcast to everyone including yourself
    socket.nsp.in(data.gameID).emit('gameInit', {players: players});
  })

  socket.on('playerAction', async function(data){
    console.log(data)
    //if end turn then go to the next player
    switch (data.actionType){
      case "endTurn":
        await endTurn(socket, players);
        break;
      case "newGame":
        await newGame(socket, players, bullyCards, mainCards);
        break;
      default:
        players[players.findIndex(x => x.sessionID === socket.id)].currentAction = data.action;
        break;
    }     

    socket.nsp.in(data.gameID).emit('gameInit', {players: players, bullyCards: bullyCards, mainCards: mainCards});
  })

  //disconnect socket
  socket.on('disconnect', function() {
    
  });
});

// //api route for outside messages
// app.post('/message', isAuthenticatedService, async function (req, res) {

//   var target = _.find(connections, x => x.userID === req.query.id)

//   switch (req.query.action){
//     case "notification":
//       await setNotification(req.body);
//       //emit if connection found
//       if(target){
//         target.socket.emit('notification', 'trigger get notification');
//         res.send(200);
//       }
//       else{
//         res.send(404);
//       }
//   }
//   //io.sockets.emit('notification', 'trigger get notification')
// })



//api routes


/////////Make sure this is set last as this handles the routes with wildcard (static files)
app.get('/*', (req,res) =>{
    console.log('***************************hit main app')
    //console.log('*********************************Cookies: ', req.cookies['trt-rate-guide-token']);
    //var test = JSON.parse(req.cookies['trt-rate-guide-token']);
    //console.log(test)
    res.sendFile(path.join(__dirname+'frontend/build/index.html'));
  });


app.use((req, res, next) => {
    // catch 404 and forward to error handler
    const err = new Error("Resource Not Found");
    err.status = 404;
    next(err);
  });
  
app.use((err, req, res, next) => {
  console.error({
    message: err.message,
    error: err
  });
  const statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    message = "Internal Server Error";
  }
  res.status(statusCode).json({ message });
});

//module.exports = app;
module.exports = server;