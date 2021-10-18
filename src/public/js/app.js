const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const socket = io();
const $myFace = $('#myFace');
const $muteBtn = $('#mute');
const $cameraBtn = $('#camera');
const $selectCameara = $('select#cameras');

let myStream;

let muted = false;
let cameraOff = false;

async function getCameras() {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const camears = devices.filter(device => device.kind === 'videoinput');

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
async function getMedia() {
	try {
		myStream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true,
		});
		$myFace.srcObject = myStream;

		await getCameras();
	} catch (e) {
		console.log(e);
	}
}

getMedia();

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

$muteBtn.addEventListener('click', handlerMuteClick);
$cameraBtn.addEventListener('click', handlerCameraClick);
