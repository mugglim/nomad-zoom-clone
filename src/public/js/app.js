const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
	console.log('Conncted to Server ✅');
});

socket.addEventListener('message', message => {
	console.log(`From Server : ${message.data}`);
});

socket.addEventListener('close', () => {
	console.log('Disconncted to Server ⛔');
});

// Client -> Server
setTimeout(() => {
	socket.send('Hello Server!');
}, 1000);
