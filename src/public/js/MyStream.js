const INIT_CONTRAINS = {
	audio: true,
	video: true,
};

const audioConstrains = {};

function MyStream(socket) {
	this.stream = null;
	this.socket = socket;

	this.getAudioConstraints = deviceId => {
		return { audio: { deviceId }, video: true };
	};

	this.setStream = async deviceId => {
		this.stream = await navigator.mediaDevices.getUserMedia(
			!deviceId ? INIT_CONTRAINS : getAudioConstraints(deviceId),
		);
	};

	this.toggleVideo = () => {
		this.stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
	};

	this.getTracks = () => this.stream.getTracks();
}
