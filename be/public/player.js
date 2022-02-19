const socket = new WebSocket('ws://212.111.203.181/video')
const player = document.getElementById('player');
player.width = 640;
player.height = 480;
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
