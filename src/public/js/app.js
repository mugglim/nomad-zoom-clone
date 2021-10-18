const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const $nickForm = $('#nick');
const $messageForm = $('#message');
const $messageList = $('ul');

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
	console.log('Conncted to Server ✅');
});

socket.addEventListener('message', message => {
	const $li = document.createElement('li');
	$li.innerText = message.data;
	$messageList.append($li);
});

socket.addEventListener('close', () => {
	console.log('Disconncted to Server ⛔');
});

function makeMessage({ type, payload }) {
	return JSON.stringify({ type, payload });
}

function handleSubmit(e) {
	e.preventDefault();
	const $input = $('input', $messageForm);

	socket.send(
		makeMessage({
			type: 'new_message',
			payload: $input.value,
		}),
	);

	$input.value = '';
}

function handleNickSubmit(e) {
	e.preventDefault();
	const $input = $('input', $nickForm);

	socket.send(
		makeMessage({
			type: 'nickname',
			payload: $input.value,
		}),
	);
}

$messageForm.addEventListener('submit', handleSubmit);
$nickForm.addEventListener('submit', handleNickSubmit);
