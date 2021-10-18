const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const socket = io();

const $welcome = $('#welcome');
const $form = $('form', $welcome);
const $room = $('#room');

let roomName = '';
$room.hidden = true;

function showRoom() {
	$welcome.hidden = true;
	$room.hidden = false;

	const $roomName = $('h3', $room);
	$roomName.innerText = `Room: ${roomName}`;
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

$form.addEventListener('submit', handleRoomSubmit);
