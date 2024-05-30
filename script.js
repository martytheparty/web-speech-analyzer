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

let propertiesHTML = '<table><tr><td>PROPERTIES</td></tr>'

for (let key in recognition) {
    console.log(key + ": " + recognition[key]);
    properties.push(key);
    propertiesHTML = propertiesHTML + `<tr><td>${key}</td></tr>`;
}

propertiesHTML = propertiesHTML + '</table>';

document.getElementById('properties').innerHTML = propertiesHTML;

// does not work
console.log("Using Object.keys():");
Object.keys(recognition).forEach(key => {
  console.log(key + ": " + recognition[key]);
});