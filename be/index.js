const express = require("express");
const expressWebSocket = require('express-ws');
const websocketStream = require('websocket-stream/stream');
const app = express();
const cp = require('child_process');
const udp = require('dgram');

// --------------------ffmpeg udp server --------------------

const ffmpeg = cp.spawn("ffmpeg", [
    "-re",
    "-y",
    "-i",
    `udp://localhost:2222?buffer_size=900000?fifo_size=100000`,
    "-preset",
    "ultrafast",
    "-f",
    "mjpeg",
    "pipe:1"
]);

ffmpeg.on("error", error => {
    console.log(`Error: ${error.message}`); 
}); 

ffmpeg.stderr.on("data", data => {
    console.log(Buffer.from(data).toString());
});



//  ---------------------------------------udp proxy-----------------------------------------

// const server = udp.createSocket('udp4');


// server.on('error', (error) => {
//   console.log(error);
//   server.close();
// });

// server.on('message', (msg, info) => {
//     console.log('Data received from : ' + JSON.stringify(info));

//     server.send(msg, 1111, 'localhost', (error) => {
//           if (error) console.log(error);
//     });
  
//   });


// server.on('listening', () => {
//   const address = server.address();
//   console.log(`Server is listening at port: ${address.port}`);
//   console.log(`Server ip: ${address.address}`);
//   console.log(`Server is IP4/IP6: ${address.family}`);
// });


// server.on('close', () => {
//   console.log('Socket is closed !');
// });

// server.bind(2222);


//  ---------------------------------------express server-----------------------------------------
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
    console.log(`udp://localhost:2222`, 'http://localhost:3000');
});

