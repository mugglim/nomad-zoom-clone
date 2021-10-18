const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));
const socket = io();
const $myFace = $('#myFace');
const $peerFace = $('#peerFace');
const $welcome = $('#welcome');
const $welcomeForm = $('form', $welcome);
const $room = $('#room');
const myStream = new MyStream(socket);

let myPeerConnection;
let roomName;
$room.hidden = true;

function showRoom() {
	$welcome.hidden = true;
	$room.hidden = false;
}

async function initStream() {
	await myStream.setStream();
	$myFace.srcObject = myStream.stream;
}
function initPeerConnection() {
	myPeerConnection = new PeerConnection(socket, $peerFace, myStream.stream);
	myPeerConnection.setEvent();
}

async function initCall() {
	showRoom();
	await initStream();
	initPeerConnection();
}

async function handleWelcomeSubmit(e) {
	e.preventDefault();
	await initCall();
	const $input = $('input', $welcomeForm);
	socket.emit('join_room', $input.value);
	roomName = $input.value;
	$input.value = '';
}

$welcomeForm.addEventListener('submit', handleWelcomeSubmit);

socket.on('welcome', async () => {
	await myPeerConnection.sendOffer(roomName);
});

socket.on('offer', async offer => {
	await myPeerConnection.reciveOffer(offer, roomName);
});

socket.on('answer', async answer => {
	await myPeerConnection.reciveAnswer(answer);
});

socket.on('ice', ice => {
	myPeerConnection.addIce(ice);
});
