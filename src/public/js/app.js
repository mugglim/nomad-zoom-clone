const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const $messageForm = $('form');
const $messageList = $('ul');

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

$messageForm.addEventListener('submit', e => {
	e.preventDefault();
	const $input = $('input', $messageForm);
	socket.send($input.value);
	$input.value = '';
});
