const socket = new WebSocket('ws://localhost:3000/video')
const player = document.getElementById('player');
var context = player.getContext('2d');
var imageObj = new Image();

socket.onmessage = function(event) {
    imageObj.src = URL.createObjectURL(event.data);
    imageObj.onload = function(){
      context.height = imageObj.height;
      context.width = imageObj.width;
      context.drawImage(imageObj, 0, 0, context.width, context.height);
    }
  };