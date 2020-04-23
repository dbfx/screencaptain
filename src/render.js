// Video
const videoElement = document.querySelector('video');
const videoHolder = document.getElementById('videoHolder');

// Layout
const heroSection = document.getElementById('heroSection');
const subtitle = document.getElementById('subtitle');
const introText = document.getElementById('introText');


// Window controls
const closeBtn = document.getElementById('close');
closeBtn.onclick = e => {
    window.close();
};

// Website
const { shell } = require('electron')
const websiteButton = document.getElementById('visitWebsite');
websiteButton.onclick = e => {
    shell.openExternal('https://blakey.co/screencaptain/');
}

// Buttons
const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
    mediaRecorder.start();
    startBtn.classList.add('hidden');

    subtitle.innerHTML = 'Recording...';
    heroSection.classList.add('is-danger');
    stopBtn.classList.remove('hidden');
};

const stopBtn = document.getElementById('stopBtn');
stopBtn.onclick = e => {
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    heroSection.classList.remove('is-danger');
    subtitle.innerHTML = 'Click Record to begin...';
  };

const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;


// Requirements
const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;


// Get video sources
async function getVideoSources() {

    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            }
        })
    );

    videoOptionsMenu.popup();
}


// Media recorder and chunk storage
let mediaRecorder; 
const recordedChunks = [];


// Change video source to a window
async function selectSource(source) {
    introText.classList.add('hidden');

    videoSelectBtn.innerText = 'Recording: ' + source.name;

    const constraints = {
        audio: false, 
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    }

    // Create a streaming video
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Preview the source
    videoElement.srcObject = stream;
    videoElement.play();

    // Create a recorder
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);

    // Event handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;    

    startBtn.classList.remove('hidden');   
    videoHolder.classList.remove('hidden');   

    subtitle.innerHTML = 'Click Record to begin...';
    console.log('Source selected') 
}


// Store the video chunks as they arrive
function handleDataAvailable(e) {
    recordedChunks.push(e.data);
}

const { dialog } = remote;
const { writeFile } = require('fs');

// Save the video when stopped
async function handleStop(e) {
    console.log('Recording stopped')
    const blob = new Blob(recordedChunks, { 
        type: 'video/webm; codecs=vp9'
    });
     
    const buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Capture',
        defaultPath: `captain-${Date.now()}.webm`
    });

    writeFile(filePath, buffer, () => console.log('Video saved successfully'));

    var notif = new window.Notification('Video save completed.', {
        body: filePath,
        silent: false
      });            
}
