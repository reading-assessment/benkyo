import { Button, Form, Header, Message, Grid, Segment, Progress, Container } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux';
import Recorder from 'recorderjs';
import io from 'socket.io-client';
import ss from 'socket.io-stream';

class AssessmentRecording extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      audioContext: new (window.AudioContext || window.webkitAudioContext),
      recording_started: false,
      input: null,
      recorder: null,
    }
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.cleanAudioBlob = this.cleanAudioBlob.bind(this);
  }

    /**
    * Starts the recording process by requesting the access to the microphone.
    * Then, if granted proceed to initialize the library and store the stream.
    *
    * It only stops when the method stopRecording is triggered.
    */
  startRecording() {
    const {audioContext} = this.state;
    var constraints = {audio:true, video:false};
    // Access the Microphone using the navigator.mediaDevices.getUserMedia method to obtain a stream, HMTL5
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream){
      window.audio_stream = stream;
      // Create the MediaStreamSource for the Recorder library
      window.input = audioContext.createMediaStreamSource(stream);
      console.log('Media stream succesfully created');

      // Initialize the Recorder Library (custom)
      window.recorder = new Recorder(window.input);
      console.log('Recorder initialised');

      // Start recording !
      window.recorder && window.recorder.record();
      console.log('Recorder started');
      this.setState({recording_started: true});

      // Disable Record button and enable stop button !
    }.bind(this))
    .catch(function(err) {
      /* handle the error */
    });
  }

  /**
  * Stops the recording process. The method expects a callback as first
  * argument (function) executed once the AudioBlob is generated and it
  * receives the same Blob as first argument. The second argument is
  * optional and specifies the format to export the blob either wav or mp3
  */
  cleanAudioBlob(blob) {
    // Note:
    // Use the AudioBLOB for whatever you need, to download
    // directly in the browser, to upload to the server, you name it !
    // AudioBLOB variable contains the actual wav file

    // In this case we are going to add an Audio item to the list so you
    // can play every stored Audio

    // ----------------JOHN CODE----------------------------
    // Sockets.io and socketio-stream code
    var URL_SERVER = 'https://localhost:9005';
    // io is a globally available variable from socketio cdn that is imported
    var socket = io.connect(URL_SERVER);
    // ss is socketio-stream globally available variable from imported file
    var socketioStream = ss.createStream();
    ss(socket).emit('client-stream-request', socketioStream, {
      wavFileSize: AudioBLOB.size,
      studentName : document.getElementById('btnStudentName').value
    }, (confirmation) =>{
      console.log(confirmation);
      socket.disconnect(URL_SERVER);
      this.setState({finishedRecording: true});
    });
    var blobStream = ss.createBlobReadStream(AudioBLOB);
    var size = 0;
    var progressBar = document.getElementsByTagName('progress')[0];
    blobStream.on('data', function(chunk){
      size += chunk.length;
      progressBar.setAttribute('value', String(size / AudioBLOB.size * 100));
      // console.log(Math.floor(size / AudioBLOB.size * 100) + '%');
    });
    blobStream.pipe(socketioStream);
    // socket.disconnect(URL_SERVER);
    // code before the progress bar
    // ss.createBlobReadStream(AudioBLOB).pipe(socketioStream);
    // -----------------------------------------------------

    //------Append wav file to li item and make it available in HTML5 audio player
    var url = URL.createObjectURL(AudioBLOB);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');

    au.controls = true;
    au.src = url;
    hf.href = url;
    // Important:
    // Change the format of the file according to the mimetype
    // e.g for audio/wav the extension is .wav
    //     for audio/mpeg (mp3) the extension is .mp3
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);
  }

  stopRecording(callback, AudioFormat) {
    // Stop the recorder instance
    window.recorder && window.recorder.stop();
    console.log('Stopped recording.');

    // Stop the getUserMedia Audio Stream !
    // HTML5
    window.audio_stream.getAudioTracks()[0].stop();

    // Disable Stop button and enable Record button !
    this.setState({recording_started: false})

    // Use the Recorder Library to export the recorder Audio as a .wav file
    // The callback providen in the stop recording method receives the blob
    /**
    * Export the AudioBLOB using the exportWAV method.
    * Note that this method exports too with mp3 if
    * you provide the second argument of the function
    */
    // Custom library
    window.recorder && window.recorder.exportWAV(function (blob) {
      this.cleanAudioBlob(blob);

      // create WAV download link using audio data blob
      // createDownloadLink();

      // Clear the Recorder to start again !
      window.recorder.clear();
    }.bind(this), ("audio/mpeg" || "audio/wav"));
  }

  render() {
    const {recording_started} = this.state;
    return (
      <Container>
        <h1>Recorder.js export example</h1>

        <p>Make sure you are using a recent version of Google Chrome.</p>
        <p>Also before you enable microphone input either plug in headphones or turn the volume down if you want to avoid ear splitting
          feedback!
        </p>

        <input type="text" placeholder="student name" required id="btnStudentName"/>

        <Button disabled={recording_started} onClick={this.startRecording}>Start recording</Button>
        <Button disabled={!recording_started} onClick={this.stopRecording}>Stop recording</Button>

        <Header as='h2'>Stored Recordings</Header>
        <ul id="recordingslist"></ul>
        <Progress value="0" total="100"></Progress>
        <div id="div-red">Please wait until finished message shows to close the browser!
          <div id="div-finished-message"></div>
        </div>
      </Container>
    )
  }
}

window.AssessmentRecording = AssessmentRecording;