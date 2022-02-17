const express = require("express");
const expressWebSocket = require('express-ws');
const websocketStream = require('websocket-stream/stream');
const app = express();
const os = require('os');
const ifaces = os.networkInterfaces();
const ip = ifaces.ens160.find(face => face.family === 'IPv4');
const cp = require('child_process');


const ffmpeg = cp.spawn("ffmpeg", [
    "-re",
    "-y",
    "-i",
    `udp://${ip.address}:2222?buffer_size=10000000?fifo_size=100000`,
    "-preset",
    "ultrafast",
    "-f",
    "mjpeg",
    "pipe:1"
]);

ffmpeg.on("error", error => {
    console.log(`error: ${error.message}`); 
}); 

ffmpeg.stderr.on("data", data => {
    console.log(data);
});


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
  
    ffmpeg.stdout.on('data', function (data) {
        try {
            stream.write(data);
        } catch(err){}
    });
});
 
app.listen(3000, ()=>{
    console.log(`udp://${ip.address}:2222`, 'http://localhost:3000');
});

