import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

// express is http
// express는 ws 프로토콜을 지원하지 않음.
const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

// Http와 Wss를 모두 사용할 수 있음.

// create htpp server
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', socket => {
	socket.onAny(e => {
		console.log(`Sockent Event: ${e}`);
	});

	// callback 함수도 처리 가능 Ex) (messsage, callback) => {}
	socket.on('enter_room', (roomName, done) => {
		socket.join(roomName);
		done();
	});
});

// http
httpServer.listen(3000, () => console.log('Listening on http://localhost:3000'));
