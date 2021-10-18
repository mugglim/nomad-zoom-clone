const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const socket = io();
const $myFace = $('#myFace');
const $muteBtn = $('#mute');
const $cameraBtn = $('#camera');
const $selectCameara = $('select#cameras');
const $selectAudio = $('select#audios');

const $welcome = $('#welcome');
const $call = $('#call');

let myStream;
let muted = false;
let cameraOff = false;
$call.hidden = true;

async function getCameras() {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();

		const audios = devices.filter(devices => devices.kind === 'audioinput');
		const camears = devices.filter(device => device.kind === 'videoinput');
		const currentAudio = myStream.getAudioTracks()[0];

		audios.forEach(audio => {
			const $option = document.createElement('option');
			$option.value = audio.deviceId;
			$option.innerText = audio.label;

			if (currentAudio.label === audio.label) {
				$option.selected = true;
			}

			$selectAudio.appendChild($option);
		});

		camears.forEach(camera => {
			const $option = document.createElement('option');
			$option.value = camera.deviceId;
			$option.innerText = camera.label;
			$selectCameara.appendChild($option);
		});
	} catch (e) {
		console.log(e);
	}
}
async function getMedia(deviceId) {
	const inintalContrains = {
		audio: true,
		video: true,
	};

	const audioConstrains = {
		audio: { deviceId },
		video: true,
	};

	try {
		myStream = await navigator.mediaDevices.getUserMedia(
			deviceId ? audioConstrains : inintalContrains,
		);
		$myFace.srcObject = myStream;

		if (!deviceId) {
			await getCameras();
		}
	} catch (e) {
		console.log(e);
	}
}

function handlerMuteClick() {
	myStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));

	if (muted) {
		$muteBtn.innerText = 'Unmute';
		muted = false;
	} else {
		$muteBtn.innerText = 'mute';
		muted = true;
	}
}

function handlerCameraClick() {
	myStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));

	if (cameraOff) {
		$cameraBtn.innerText = 'Turn Camera Off';
		cameraOff = false;
	} else {
		$cameraBtn.innerText = 'Turn Camera On';
		cameraOff = true;
	}
}

async function handleAudioChange() {
	// Change track on my stream
	await getMedia($selectAudio.value);
	// Change track on peer stream
	if (myPeerConnection) {
		// (2) [RTCRtpSender, RTCRtpSender]
		const audioTrack = myStream.getAudioTracks()[0];
		const audioSender = myPeerConnection
			.getSenders()
			.find(sender => sender.track.kind === 'audio');

		// Sender : Peer로 보내진 media stream의 track을 컨트롤 할 수 있는 주체

		audioSender.replaceTrack(audioTrack);
	}
}

$muteBtn.addEventListener('click', handlerMuteClick);
$cameraBtn.addEventListener('click', handlerCameraClick);
$selectAudio.addEventListener('input', handleAudioChange);

// Socket (Join a Room)
const $welcomeForm = $('form', $welcome);
let roomName;
let myPeerConnection;

async function initCall() {
	$welcome.hidden = true;
	$call.hidden = false;
	await getMedia();
	makeConnection();
}

async function handleWelcomeSubmit(e) {
	e.preventDefault();
	const $input = $('input', $welcomeForm);
	await initCall();
	socket.emit('join_room', $input.value);
	roomName = $input.value;
	$input.value = '';
}

$welcomeForm.addEventListener('submit', handleWelcomeSubmit);

// Socket Event Code..
socket.on('welcome', async () => {
	const offer = await myPeerConnection.createOffer();
	myPeerConnection.setLocalDescription(offer);
	console.log('sent the offer');
	socket.emit('offer', offer, roomName);
});

socket.on('offer', async offer => {
	console.log('recived the offer');
	// Peer B
	myPeerConnection.setRemoteDescription(offer);
	const answer = await myPeerConnection.createAnswer();
	myPeerConnection.setLocalDescription(answer);
	socket.emit('answer', answer, roomName);
	console.log('sent the answer');
});

socket.on('answer', async answer => {
	console.log('recived the answer');
	// Peer A
	myPeerConnection.setRemoteDescription(answer);
});

socket.on('ice', ice => {
	console.log('recivied candidate');
	myPeerConnection.addIceCandidate(ice);
});

// RTC Code...
function makeConnection() {
	// Connect by Peer to Perr

	// stun server : 동일 Network 환경이 아닌 경우, 서로의 공용 IP를 찾아 P2P 통신할 수 있도록 도와주는 서버
	myPeerConnection = new RTCPeerConnection({
		iceServers: [
			{
				urls: [
					// 구글에서 제공하는 무료 stun 서버를 사용(테스트 용도임, 배포시 사용하면 위험)
					'stun:stun.l.google.com:19302',
					'stun:stun1.l.google.com:19302',
					'stun:stun2.l.google.com:19302',
					'stun:stun3.l.google.com:19302',
					'stun:stun4.l.google.com:19302',
				],
			},
		],
	});
	myPeerConnection.addEventListener('icecandidate', handleIce);
	myPeerConnection.addEventListener('addstream', handleAddStream);
	// Add Video and Audio data to Peer to Peer Connection
	myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
}

// IceCandidate : WebRTC에서 데이터 통신을 위한 프로토콜(Peer To Peer 을 위한..)
// candidate은 다른 Clinet의 브라우저로 전송되야 한다.
function handleIce(data) {
	console.log('sent candidate');
	socket.emit('ice', data.candidate, roomName);
}

function handleAddStream(data) {
	const $peerFace = $('#peerFace');
	$peerFace.srcObject = data.stream;
}
