import { Button, Form, Header, Message, Grid, Segment, Progress, Container } from 'semantic-ui-react'
import axios from 'axios'
import { connect } from 'react-redux';
import Recorder from 'recorderjs';
import io from 'socket.io-client';
import ss from 'socket.io-stream';
import Promise from 'bluebird'
/*
@connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    role: store.authentication.role
  }
})
 */
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

    /**
    * Starts the recording process by requesting the access to the microphone.
    * Then, if granted proceed to initialize the library and store the stream.
    *
    * It only stops when the method stopRecording is triggered.
    */
  startRecording() {
    const {audioContext} = this.state;
    const {user_cred, assignmentId} = this.props;

    firebase.database().ref(`student/${user_cred.uid}/assignment/${assignmentId}`).update({status:'started'})
    firebase.database().ref(`assignment/${assignmentId}/results`).update({status:'started'})
    var constraints = {audio:true, video:false};
    // Access the Microphone using the navigator.mediaDevices.getUserMedia method to obtain a stream, HMTL5
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream){
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
    socket.emit('bucket-stored', {
      user_cred,
      classroomId,
      assessmentId,
      assignmentId,
      downloadURL,
      filePrefix
    }, (confirmation)=>{
      if (confirmation) {
        socket.disconnect();
      }
    });
    // ------OLD CODE when we sent the file to DO instead of google bucket---------
    // ss is socketio-stream globally available variable from imported file
    // var socketioStream = ss.createStream();
    // ss(socket).emit('client-stream-request', socketioStream, {
    //   // wavFileSize: blob.size,
    //   studentId : user_cred.uid,
    //   classroomId: classroomId,
    //   assessmentId: assessmentId,  // T1. T2. Z1. Z2
    //   assignmentId: assignmentId //firebase pushed key for location of assessment data
    // }, function(confirmation) {
    //   // console.log(confirmation);
    //   socket.disconnect(URL_SERVER);
    //   // this.setState({finishedRecording: true});
    // }.bind(this));
    // var blobStream = ss.createBlobReadStream(blob);
    // var size = 0;

    // blobStream.on('data', function(chunk){
    //   size += chunk.length;

    //   this.setState({percentComplete: size / blob.size * 100})
    //   // console.log(Math.floor(size / AudioBLOB.size * 100) + '%');
    //   if (size / blob.size >= 1){
    //     firebase.database().ref(`student/${user_cred.uid}/assignment/${assignmentId}`).update({status:'processing'});
    //     firebase.database().ref(`assignment/${assignmentId}/results`).update({status:'processing'});
    //   }
    // }.bind(this));
    // blobStream.pipe(socketioStream);

    // socket.disconnect(URL_SERVER);
    // code before the progress bar
    // ss.createBlobReadStream(AudioBLOB).pipe(socketioStream);
    // ---------------------END OLD CODE--------------------------------

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
    //     for audio/mpeg (mp3) the extension is .mp3
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
      var d = new Date();
      var timestamp = d.getTime().toString();
      var fileName = user_cred.uid + 'TTTT' + timestamp + '.wav';
      console.log(timestamp);
      var audioRef = firebase.storage().ref().child(`audio/${fileName}`);
      var uploadTask = audioRef.put(blob);
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        this.setState({percentComplete: progress});
      }.bind(this), function (error){

      }, function(){
        var d = new Date();
        var timestamp = d.getTime().toString();
        var filePrefix = user_cred.uid + 'TTTT' + timestamp;
        var fileNameWAV = filePrefix + '.wav';
        var downloadURL = uploadTask.snapshot.downloadURL;
        this.cleanAudioBlob(blob, downloadURL, filePrefix);
        
        console.log('Uploaded a blob', downloadURL);
      }.bind(this));
      // ----------MAX working code------------
      // audioRef.put(blob).then(function(snapshot){
      //   firebase.database().ref(`student/${user_cred.uid}/assignment/${assignmentId}`).update({status:'processing'});
      //   firebase.database().ref(`assignment/${assignmentId}/results`).update({status:'processing'});
      //   console.log('Uploaded a blob');
      //   this.cleanAudioBlob(blob);
      // }.bind(this));
      //----------END OF MAX WORKING CODE, BEGIN MAX COMMENTS-------------
      // console.log(blob);
      // new Promise(function(resolve, reject) {
      //   Notification.requestPermission(function(result) {
      //     if (result !== 'granted') return reject(Error("Denied notification permission"));
      //     resolve();
      //   })
      // }).then(function() {
      //   return navigator.serviceWorker;
      // }).then(function(reg) {
      //   var options = {
      //     blob: blob,
      //     uid: user_cred.uid,
      //     classroomId: classroomId,
      //     assessmentId: assessmentId,
      //     assignmentId: assignmentId
      //   }
      //   reg.controller.postMessage({type: 'upload', options});
      //   return navigator.serviceWorker.ready;
      // }).then(function(reg) {
      //   return reg.sync.register("Let's Upload!");
      // }).catch(function(err) {
      //   console.log('It broke');
      //   console.log(err.message);
      // });



      // create WAV download link using audio data blob
      // createDownloadLink();

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
        <Progress value="0" total="100" percent={Math.floor(percentComplete)} indicating progress='percent'>{(finishedRecording)?('Upload Completed! =D'):null}</Progress>
      </Container>
    )
  }
}


window.AssessmentRecording = connect((store) => {
  return {
    user_cred: store.authentication.user_cred,
    role: store.authentication.role
  }
})(AssessmentRecording);



// window.AssessmentRecording = AssessmentRecording;