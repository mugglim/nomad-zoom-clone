const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const socket = io();
const $myFace = $('#myFace');
const $muteBtn = $('#mute');
const $cameraBtn = $('#camera');

let myStream;

let muted = false;
let cameraOff = false;

async function getMedia() {
	try {
		myStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});
		$myFace.srcObject = myStream;
	} catch (e) {
		console.log(e);
	}
}

getMedia();

function handlerMuteClick() {
	if (muted) {
		$muteBtn.innerText = 'Unmute';
		muted = false;
	} else {
		$muteBtn.innerText = 'mute';
		muted = true;
	}
}

function handlerCameraClick() {
	if (cameraOff) {
		$cameraBtn.innerText = 'Turn Camera On';
		cameraOff = false;
	} else {
		$cameraBtn.innerText = 'Turn Camera Off';
		cameraOff = true;
	}
}

$muteBtn.addEventListener('click', handlerMuteClick);
$cameraBtn.addEventListener('click', handlerCameraClick);
