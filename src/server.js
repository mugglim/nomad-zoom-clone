import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

wsServer.on('connection', socket => {
	// Get Stream -> new RTCPeerConnection -> Create Offer
	socket.on('join_room', roomName => {
		socket.join(roomName);
		socket.to(roomName).emit('welcome');
	});

	// PeerA -> PeerB
	socket.on('offer', (offer, roomName) => {
		socket.to(roomName).emit('offer', offer);
	});

	// PeerA <- PeerB
	socket.on('answer', (answer, roomName) => {
		socket.to(roomName).emit('answer', answer);
	});

	// PeerA <-> PeerB
	socket.on('ice', (ice, roomName) => {
		socket.to(roomName).emit('ice', ice);
	});
});

httpServer.listen(3000, () => console.log('Listening on http://localhost:3000'));
