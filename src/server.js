import express from 'express';
import http from 'http';
import WebSocket from 'ws';

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
const server = http.createServer(app);
// ws로 upgrade
const wss = new WebSocket.Server({ server });

wss.on('connection', socket => {
	console.log('Conncted to Client ✅');

	socket.send('Hello World :D');

	socket.on('message', message => {
		console.log(`From Clinet : ${message}`);
	});

	socket.on('close', () => console.log('Disconncted to Client ⛔'));
});

// http
server.listen(3000, () => console.log('Listening on http://localhost:3000'));
