const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const socket = io();

const $welcome = $('#welcome');
const $form = $('form', $welcome);
const $room = $('#room');

let roomName = '';
$room.hidden = true;

function handleMessageSubmit(e) {
	e.preventDefault();
	const $input = $('input', $room);
	const { value } = $input;
	socket.emit('new_message', $input.value, roomName, () => {
		addMessage(`You : ${value}`);
	});
	$input.value = '';
}

function showRoom() {
	$welcome.hidden = true;
	$room.hidden = false;
	const $roomName = $('h3', $room);
	$roomName.innerText = `Room: ${roomName}`;

	const $form = $('form', $room);
	$form.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(e) {
	e.preventDefault();
	const $input = $('input', $form);
	// type, payload, [,args,callback]
	// callBack 함수도 서버에게 전달할 수 있다.
	socket.emit('enter_room', $input.value, showRoom);
	roomName = $input.value;
	$input.value = '';
}

function addMessage(message) {
	const $ul = $('ul', $room);
	const $li = document.createElement('li');
	$li.innerText = message;
	$ul.appendChild($li);
}

$form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
	addMessage('Someone is joined');
});

socket.on('exit_room', () => {
	addMessage('Someone left ㅠㅠ.');
});

socket.on('new_message', addMessage);
