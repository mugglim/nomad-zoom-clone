function PeerConnection(socket, $peerFace, stream) {
	this.socket = socket;
	this.stream = stream;
	this.$peerFace = $peerFace;
	this.peerConnection = new RTCPeerConnection({
		iceServers: [
			{
				urls: [
					// stun server : 동일 Network 환경이 아닌 경우, 서로의 공용 IP를 찾아 P2P 통신할 수 있도록 도와주는 서버
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

	this.sendOffer = async roomName => {
		const offer = await this.peerConnection.createOffer();
		this.peerConnection.setLocalDescription(offer);
		socket.emit('offer', offer, roomName);
	};

	this.reciveOffer = async (offer, roomName) => {
		this.peerConnection.setRemoteDescription(offer);
		const answer = await this.peerConnection.createAnswer();
		this.peerConnection.setLocalDescription(answer);
		socket.emit('answer', answer, roomName);
	};

	this.reciveAnswer = async answer => {
		this.peerConnection.setRemoteDescription(answer);
	};

	this.addIce = ice => {
		this.peerConnection.addIceCandidate(ice);
	};

	this.handleIce = data => {
		socket.emit('ice', data.candidate, roomName);
	};

	this.handleAddStream = data => {
		console.log(this.stream, data.stream);
		this.$peerFace.srcObject = data.stream;
	};

	this.setEvent = () => {
		this.peerConnection.addEventListener('icecandidate', this.handleIce);
		this.peerConnection.addEventListener('addstream', this.handleAddStream);
		this.stream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.stream));
	};
}
