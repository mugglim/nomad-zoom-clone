# Run WebRTC

`노마드 코더`님의 영상을 참고하여, WebRTC를 이용하여 `ZOOM`을 클론해보자!

-   [lecture link](https://nomadcoders.co/noom/lobby)

## Socket.IO

-   `Web Socket`을 사용하는 프레임워크이다.
-   `Web Socket`을 제공하지 않은 환경에서 다른 방법으로 통신한다.
    -   Ex) poling
-   Socket 연결이 끊킨 경우에도, 자동으로 재연결을 시도한다. (편안~)
-   `Object` Type의 데이터도 **알아서** stringfy, parsing을 해준다. 🚀
-   callback 함수도 서버에게 전달 하여, 서버에서 콜백 함수를 호출하면  
    서버 단이 아닌, **클라이언트 단에서 처리한다.** (보안상의 위험 방지 Ex) DB삭제 콜백)

    -   단, 반드시 callback 함수는 마지막 인자로 전달해야 한다.
        -   (x) (arg1,callback,arg2)
        -   (o) (arg1, arg2, ..., callback)

    ```js
    // Client
    socket.emit('enter_room', $input.value, showRoom);

    // Server
    socket.on('enter_room', (payload, done) => {
    	// .. logic
    	done();
    });
    ```

-   socket은 각자 1개의 private room을 가진다.
    ```js
    console.log(socket.id);
    console.log(socket.rooms); // private room
    socket.join(roomName);
    console.log(socket.rooms); // {private room, roonName}
    ```

## WebRTC

## Todo

-   React로 Client를 변경해보자
-   `Data Channel`을 도입하여, Stream(비디오, 오디오) 뿐만 아니라 텍스트, 파일들을 전송해보자 (socket이 필요 없어진다..?)
-   사용자가 브라우저를 종료할 때, Stream을 없애보자
