
//#1 Declaramos el objeto socket que se conectará en este caso a localhost
var socket = io.connect('http://localhost:3000');

//#2 Función que muestra un mensaje u otro, dependiendo de la conexión.
function toggle(){
  $("#disconected").toggleClass("hide");
  $("#connected").toggleClass("hide");
}

//#3 Si estamos conectados, muestra el log y cambia el mensaje
socket.on('connected', function () {
  console.log('Conectado!');
  toggle();
});

//#4 Si pulsas el botón, envía el evento click
$('#butons').click(function(){
  socket.emit('click');
});

//#5 El servidor nos responde al click con este evento y nos da el número de clicks en el callback.
socket.on('res', function(clicks){
  console.log('Clicks: '+clicks);
  $('h2').replaceWith('<h2>Has pulsado '+clicks+' veces!');
});

//#6 Si nos desconectamos, muestra el log y cambia el mensaje.
socket.on('disconnect', function () {
  console.log('Desconectado!');
  toggle();
});
