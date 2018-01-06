import React from 'react';
import { Button, Form, Header, Message, Grid, Segment, Progress, Container, Modal, Divider, Item } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux';
import Recorder from 'recorderjs';
import io from 'socket.io-client';
import ss from 'socket.io-stream';
import Promise from 'bluebird';

export default connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    role: store.authentication.role,
    assignmentId: store.student.active_assignment.assignmentID,
    assessmentId: store.student.active_assignment.assessment,
    classroomId: store.student.active_assignment.courseID
  }
})(
class AssessmentRecording extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      audioContext: new (window.AudioContext || window.webkitAudioContext),
      recording_started: false,
      input: null,
      recorder: null,
      percentComplete: 0,
      finishedRecording: false
    }
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.cleanAudioBlob = this.cleanAudioBlob.bind(this);
  }

  componentDidMount() {
    this.startRecording();
  }

    /**
    * Starts the recording process by requesting the access to the microphone.
    * Then, if granted proceed to initialize the library and store the stream.
    *
    * It only stops when the method stopRecording is triggered.
    */
  startRecording() {
    const {audioContext} = this.state;
    const {user_cred, assignmentId, assessmentId, classroomId} = this.props;
    console.log(user_cred.uid, assignmentId, assessmentId, classroomId)

    firebase.database().ref(`student/${user_cred.uid}/assignment/${assignmentId}`).update({status:'started'});
    firebase.database().ref(`assignment/${assignmentId}/results`).update({status:'started'});

    console.log(navigator);
    console.log(navigator.mediaDevices);
    console.log(navigator.mediaDevices.getUserMedia);
    
    var constraints = {audio:true, video:false};
    // Access the Microphone using the navigator.mediaDevices.getUserMedia method to obtain a stream, HMTL5
    console.log(constraints)
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream){
      console.log('started recording');
      window.audio_stream = stream;
      // Create the MediaStreamSource for the Recorder library
      window.input = audioContext.createMediaStreamSource(stream);
      // console.log('Media stream succesfully created');

      // Initialize the Recorder Library (custom)
      window.recorder = new Recorder(window.input);
      // console.log('Recorder initialised');

      // Start recording !
      window.recorder && window.recorder.record();
      // console.log('Recorder started');
      this.setState({recording_started: true});

      // Disable Record button and enable stop button !
    }.bind(this))
    .catch(function(err) {
      /* handle the error */
      console.log(err);
    });
  }

  /**
  * Stops the recording process. The method expects a callback as first
  * argument (function) executed once the AudioBlob is generated and it
  * receives the same Blob as first argument. The second argument is
  * optional and specifies the format to export the blob either wav or mp3
  */
  cleanAudioBlob(blob, downloadURL, filePrefix) {
    // console.log('cleanAudioBlob')
    const {user_cred, classroomId, assessmentId, assignmentId} = this.props;

    // ----------------JOHN CODE----------------------------
    // Sockets.io and socketio-stream code
    var URL_SERVER = window.s_mode.app_server;
    // io is a globally available variable from socketio cdn that is imported
    var socket = io.connect(URL_SERVER);
    // console.log('seconds', blob.size/1024/1536*8);
    socket.emit('bucket-stored', {
      wavSize: blob.size,
      user_cred,
      classroomId,
      assessmentId,
      assignmentId,
      downloadURL,
      filePrefix
    }, (confirmation)=>{
      if (confirmation) {
        socket.disconnect();
        this.setState({finishedRecording: true});
        this.props.CloseAssessment();
      }
    });
    // ----------------JOHN CODE END--------------------------
    //------Append wav file to li item and make it available in HTML5 audio player
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');
    
    au.controls = true;
    au.src = url;
    hf.href = url;
    // Important:
    // Change the format of the file according to the mimetype
    // e.g for audio/wav the extension is .wav
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);
  }

  stopRecording(callback, AudioFormat) {
    const {user_cred, classroomId, assessmentId, assignmentId} = this.props;

    firebase.database().ref(`student/${user_cred.uid}/assignment/${assignmentId}`).update({status:'uploading'})
    firebase.database().ref(`assignment/${assignmentId}/results`).update({status:'uploading'})

    // Stop the recorder instance
    window.recorder && window.recorder.stop();
    // console.log('Stopped recording.');

    // Stop the getUserMedia Audio Stream !
    // HTML5
    window.audio_stream.getAudioTracks()[0].stop();

    // Disable Stop button and enable Record button !
    this.setState({recording_started: false});

    // Use the Recorder Library to export the recorder Audio as a .wav file
    // The callback providen in the stop recording method receives the blob
    /**
    * Export the AudioBLOB using the exportWAV method.
    * Note that this method exports too with mp3 if
    * you provide the second argument of the function
    */
    // Custom library
    var d = new Date();
    var timestamp = d.getTime().toString();
    window.recorder && window.recorder.exportWAV(function (blob) {
      var fileName = user_cred.uid + 'TTTT' + timestamp + '.wav';
      var audioRef = firebase.storage().ref().child(`audio/${fileName}`);
      var uploadTask = audioRef.put(blob);
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        this.setState({percentComplete: progress});
      }.bind(this), function (error){

      }, function(){
        var filePrefix = user_cred.uid + 'TTTT' + timestamp;
        var fileNameWAV = filePrefix + '.wav';
        var downloadURL = uploadTask.snapshot.downloadURL;
        this.cleanAudioBlob(blob, downloadURL, filePrefix);
        console.log('Uploaded a blob', downloadURL);
        const {audioContext} = this.state;
        // var frameCount = audioContext.sampleRate * 2.0;
        // var myArrayBuffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);
        // console.log(myArrayBuffer.duration);
      }.bind(this));

      // Clear the Recorder to start again !
      window.recorder.clear();
    }.bind(this), ("audio/mpeg" || "audio/wav"));
  }

  render() {
    const {recording_started, percentComplete, finishedRecording} = this.state;
    return (
      <Container>
        <Button.Group labeled icon fluid>
        <Button disabled={recording_started} onClick={this.startRecording} icon='unmute' content='Start Recording' color='green'/>
          
          <Button disabled={!recording_started} onClick={this.stopRecording} icon='stop' content='Stop recording' color='red'/>
        </Button.Group>

        <Header as='h2'>Stored Recordings</Header>
        <ol id="recordingslist"></ol>
        <Progress percent={Math.floor(percentComplete)} indicating progress='percent'>{(finishedRecording)?('Upload Completed! =D'):null}</Progress>
      </Container>
    )
  }
});