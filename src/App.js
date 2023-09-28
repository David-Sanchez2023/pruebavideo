import './App.css';
import { Peer } from 'peerjs';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUservideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id)
    });  

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({video: true, audio: true}, (mediaStream) => {
        currentUservideoRef.current.srcObject = mediaStream;
        currentUservideoRef.current.play();

        call.answer(mediaStream)
        call.on('stream', (remoteStream) => {
            
           remoteVideoRef.current.srcObject = remoteStream
           remoteVideoRef.current.play();
        });
      });
    })
    
    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({video: true, audio: true}, (mediaStream) => {
      
        currentUservideoRef.current.srcObject = mediaStream;
        currentUservideoRef.current.play(); 

      const call = peerInstance.current.call(remotePeerId, mediaStream);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();

          
        });
      });
    
  }

  console.log(peerId);

  return (
    <div className="App">
      <h1>{peerId}</h1>
      <input type='text' value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)} >call</button>
     <div>
       <video ref={currentUservideoRef} />
     </div>
     <div>
       <video ref={remoteVideoRef}/>
     </div>
    </div>
  );
}

export default App;
