const express = require("express");
const expressWebSocket = require('express-ws');
const websocketStream = require('websocket-stream/stream');
const app = express();
const cp = require('child_process');
var udp = require('dgram');

// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message',function(msg,info){
  console.log('Data received from client : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

//sending msg

});

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed !');
});

server.bind(2222);

// const ffmpeg = cp.spawn("ffmpeg", [
//     "-re",
//     "-y",
//     "-i",
//     `udp://localhost:2222?buffer_size=900000?fifo_size=100000`,
//     "-preset",
//     "ultrafast",
//     "-f",
//     "mjpeg",
//     "pipe:1"
// ]);

// ffmpeg.on("error", error => {
//     console.log(`Error: ${error.message}`); 
// }); 

// ffmpeg.stderr.on("data", data => {
//     console.log(Buffer.from(data).toString());
// });

expressWebSocket(app, null, {
    perMessageDeflate: false,
});

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

app.ws('/video', function(ws, req) {
    const stream = websocketStream(ws, {
        binary: true,
    });
  
    // ffmpeg.stdout.on('data', function (data) {
    //     try {
    //         stream.write(data);
    //     } catch(err){}
    // });
});
 
app.listen(3000, ()=>{
    console.log(`udp://localhost:2222`, 'http://localhost:3000');
});

