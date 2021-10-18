const $ = (query, base) => (!base ? document.querySelector(query) : base.querySelector(query));

const socket = io();
const $myFace = $('#myFace');
const $muteBtn = $('#mute');
const $cameraBtn = $('#camera');
const $selectCameara = $('select#cameras');
const $selectAudio = $('select#audios');

let myStream;

let muted = false;
let cameraOff = false;

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

async function handleAudioChange() {
	await getMedia($selectAudio.value);
}

$muteBtn.addEventListener('click', handlerMuteClick);
$cameraBtn.addEventListener('click', handlerCameraClick);
$selectAudio.addEventListener('input', handleAudioChange);
