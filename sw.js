self.importScripts(
  'https://www.gstatic.com/firebasejs/4.6.0/firebase.js',
  'https://www.gstatic.com/firebasejs/4.6.0/firebase-database.js'
)

var config = {
  apiKey: "AIzaSyDrK20nhkadydh2tv4_PNFgqQuG64Ygers",
  authDomain: "benkyohr-e00dc.firebaseapp.com",
  databaseURL: "https://benkyohr-e00dc.firebaseio.com",
  projectId: "benkyohr-e00dc",
  storageBucket: "gs://benkyohr-e00dc.appspot.com",
  messagingSenderId: "385974337950"
};
firebase.initializeApp(config);

var document = self;
const syncStore = {};

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('sync', function(event) {
  self.registration.showNotification("Sync event fired!");
});

self.addEventListener('message', event => {
  if(event.data.type === 'upload') {
    console.log(event.data);
    uploadBlob(event.data);
  }
})

function uploadBlob(passed_info) {
  const {blob, uid, classroomId, assessmentId, assignmentId} = passed_info;

  var audioBlob = new Blob(blob);

  var audioRef = firebase.storage().ref().child(`audio/${uid}/${classroomId}/${assignmentId}`);
  audioRef.put(audioBlob).then(function(snapshot){
    console.log('Uploaded a blob');
    console.log(blob);
  })
}