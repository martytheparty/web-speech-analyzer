let SpeechRecognition = undefined; 

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
    } else if (key === 'onaudiostart') {
        propertiesHTML = propertiesHTML + `<td>
        <button onclick='log("${key}")' >log</button>
        </td>`;
    } else if (key === 'onaudioend') {
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
    console.log(args.type, args.timeStamp, args);
}