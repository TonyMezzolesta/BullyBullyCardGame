const log = require("./log/index");
const express = require("express");
const app = express();
const path = require('path');
// const mongoose = require('mongoose');
const cors = require('cors');
// const userRouter = require("./userRoute/router");
// const customerRouter = require("./customerRoute/router");
// const rateRouter = require("./rateRoute/router");
// const orderRouter = require("./orderRoute/router");
// const applicationRouter = require("./applicationRoute/router");
// const notificationRouter = require('./notificationRoute/router');
// const fuelRouter = require("./fuelRoute/router");
// const accessorialRouter = require("./accessorialRoute/router");
// const dotenv = require('dotenv');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var cookieParser = require('cookie-parser');
const { setNotification } = require('./notificationRoute/mongo');
var _ = require("lodash");
//const { verifyJwtToken, isAuthenticatedService } = require("./authentication");

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

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
app.use(cookieParser())

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
var connections = []

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

  //save connection to array
  connections.push({sessionID: socket.client.id, socket: socket, userID: socket.handshake.query.user_id});

  //routes
  socket.on('sendNotification', function(data){
    console.log('***********************sendNotification: ')
    console.log(data)
    if(data){
      //data.user_id
    }
  })

  //disconnect socket
  socket.on('disconnect', function() {
    _.remove(connections, x => x.userID === socket.handshake.query.user_id)
  });
});

//api route for outside messages
app.post('/message', isAuthenticatedService, async function (req, res) {

  var target = _.find(connections, x => x.userID === req.query.id)

  switch (req.query.action){
    case "notification":
      await setNotification(req.body);
      //emit if connection found
      if(target){
        target.socket.emit('notification', 'trigger get notification');
        res.send(200);
      }
      else{
        res.send(404);
      }
  }
  //io.sockets.emit('notification', 'trigger get notification')
})



//api routes
// app.use("/api/user", userRouter);
// app.use("/api/customer", customerRouter);
// app.use("/api/rate", rateRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/application", applicationRouter);
// app.use("/api/notification", notificationRouter);
// app.use("/api/fuel", fuelRouter);
// app.use("/api/accessorial", accessorialRouter);

/////////Make sure this is set last as this handles the routes with wildcard (static files)
get('/*', (req,res) =>{
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