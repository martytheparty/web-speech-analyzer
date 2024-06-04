let SpeechRecognition = undefined; 

let logs = [];
let lastResult = '';
let lastConfidence = 0;

if (window.webkitSpeechRecognition) {
    document.getElementById('webkit').innerHTML = 'Exists';
} else {
    document.getElementById('webkit').innerHTML = 'Undefined';
}

if (window.SpeechRecognition) {
    document.getElementById('normal').innerHTML = 'Exists';
} else {
    document.getElementById('normal').innerHTML = 'Undefined';
}

SpeechRecognition =  SpeechRecognition || webkitSpeechRecognition;

let recognition = new SpeechRecognition();


const properties = Object.keys(recognition);

let propertiesHTML = '<table><tr><td>PROPERTIES</td><td>&nbsp;</td></tr>'

for (let key in recognition) {
    console.log(key + ": " + recognition[key]);
    properties.push(key);
    propertiesHTML = propertiesHTML + `<tr><td>${key}</td>`;
    if (key === 'start') {
        propertiesHTML = propertiesHTML + `<td>
        <button onclick='start()' >start</button>
        </td>`;
    } else if (key === 'stop') {
        propertiesHTML = propertiesHTML + `<td>
        <button onclick='stop()' >stop</button>
        </td>`;
    } else if (
            key === 'onaudioend' 
            || key === 'onsoundstart'
            || key === 'onspeechstart'
            || key === 'onspeechend'
            || key === 'onsoundend'
            || key === 'onresult'
            || key === 'onnomatch'
            || key === 'onerror'
            || key === 'onstart'
            || key === 'onend'
            || key === 'onaudiostart'
        ) {
        propertiesHTML = propertiesHTML + `<td>
        <button onclick='log("${key}")' >log</button>
        </td>`;
    } else {
        propertiesHTML = propertiesHTML + `<td>&nbsp;</td>`;
    }
    propertiesHTML = propertiesHTML + `</tr>`;
}

propertiesHTML = propertiesHTML + '</table>';

document.getElementById('properties').innerHTML = propertiesHTML;

// does not work
console.log("Using Object.keys():");
Object.keys(recognition).forEach(key => {
  console.log(key + ": " + recognition[key]);
});

const start = () => {
    recognition.start();
    logs = [];
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const miliseconds = now.getMilliseconds();

    lastResult = '';
    lastConfidence = 0;

    logs.push(
        { 
            type: 'start button', 
            args: 'na', 
            minutes: minutes, 
            seconds: seconds,
            milliseconds: miliseconds
        }
        );

    console.log('starting the microphone');
}

const stop = () => {
    recognition.stop();
    console.log('stoping the microphone');
}

const log = (key) => {
    console.log('adding an event listener', key);
    recognition[key] = logger;
}

const logger = (args) => {

    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const miliseconds = now.getMilliseconds();

    if (args.type === 'result') {
        lastResult = args.results[0][0].transcript;
        lastConfidence = args.results[0][0].confidence;
    }
    logs.push(
        { 
            type: args.type, 
            args: args, 
            minutes: minutes, 
            seconds: seconds,
            milliseconds: miliseconds
        }
        );
    console.log(args.type, args.timeStamp, args);
    if (args.type === 'end') {
        console.table(logs);
        console.log(lastResult, lastConfidence);
    }

}