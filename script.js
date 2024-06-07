let SpeechRecognition = undefined; 
let SpeechGrammarList = undefined;

let logs = [];
let allResults = [];
let lastResult = '';
let lastConfidence = 0;

if (window.webkitSpeechRecognition) {
    SpeechRecognition = window.webkitSpeechRecognition;
    document.getElementById('webkit').innerHTML = 'Exists';
} else {
    document.getElementById('webkit').innerHTML = 'Undefined';
}

if (window.SpeechRecognition) {
    SpeechRecognition = window.SpeechRecognition;
    document.getElementById('normal').innerHTML = 'Exists';
} else {
    document.getElementById('normal').innerHTML = 'Undefined';
}

if (window.SpeechGrammarList) {
    SpeechGrammarList = window.SpeechGrammarList;
} else if (window.webkitSpeechGrammarList) {
    SpeechGrammarList = window.webkitSpeechGrammarList;;
}



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
    } else if (key === 'maxAlternatives') {
        propertiesHTML = propertiesHTML + `<td>
        <select onchange="updateMaxAlts(this)">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
        </select>
        </td>`;
    } else if (key === 'lang') {
        propertiesHTML = propertiesHTML + `<td>
        <select onchange="updateLang(this)">
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
            <option value="es-ES">es-ES</option>
            <option value="es-MX">es-MX</option>
            <option value="fr-FR">fr-FR</option>
            <option value="fr-CA">fr-CA</option>
            <option value="de-DE">de-DE</option>
            <option value="it-IT">it-IT</option>
            <option value="ja-JP">ja-JP</option>
        </select>
        </td>`;  
        recognition.lang = "en-US";  
    } else if (key === 'continuous') {
        propertiesHTML = propertiesHTML + `<td><input onchange="updateContinous(this)" type="checkbox"></td>`;
    } else if (key === 'interimResults') {
        propertiesHTML = propertiesHTML + `<td><input onchange="updateInterim(this)" type="checkbox"></td>`;
    } else if (key === "grammars") {
        propertiesHTML = propertiesHTML + `<td>
        <table>
            <tr><td colspan=2>Grammars are not set until the button is clicked</td></tr>
            <tr>
                <td>header:</td>
                <td>
                    <input id="g-header" type="text" value="#JSGF V1.0;"></input>
                </td>
            </tr><tr>
                <td>grammar name:</td>
                <td>
                    <input id="g-name"  type="text" value="grammar colors;"></input>
                </td>
            </tr><tr>
                <td>public rule:</td>
                <td>
                    <input id="g-rule"  type="text" value="public <color> = red | blue | green ;"></input>
                </td>
            </tr>
            <tr>
                <td colspan=2>
                <button onclick='updateGrammar()' >set grammar</button>
                </td>
            </tr>
        </table></td>`;
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
    allResults = [];
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


const updateContinous = (caller) => {
    recognition.continuous = caller.checked;
}

const updateInterim = (caller) => {
    recognition.interimResults = caller.checked;
}

const log = (key) => {
    console.log('adding an event listener', key);
    //recognition[key] = logger;

    if (recognition[key]) {
        recognition.removeEventListener(key.substring(2), logger)
    } else {
        recognition.addEventListener(key.substring(2), logger)
    }

    console.log(recognition, key);
}

const logger = (args) => {

    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const miliseconds = now.getMilliseconds();

    let minBuffer = '';
    if (minutes < 10) minBuffer = '0'; 
    let secBuffer = '';
    if (seconds < 10) secBuffer = '0';

    if (args.type === 'result') {
        lastResult = args.results[0][0].transcript;
        lastConfidence = args.results[0][0].confidence;

        allResults.push({
            event: 'result',
            text: lastResult, 
            confidence: lastConfidence,
            time: `${minBuffer}${minutes}:${secBuffer}${seconds}.${miliseconds}`,
            isFinal: args.results[0].isFinal
        });
    }

    if (args.type === 'speechend') {
        allResults.push({
            event: args.type,
            time: `${minBuffer}${minutes}:${secBuffer}${seconds}.${miliseconds}`
        });
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
        console.log(recognition);
        console.table(allResults);
    }

}

const updateMaxAlts = (args) => {
    recognition.maxAlternatives = args.value;
    console.log(recognition);
}

const updateLang = (args) => {
    recognition.lang = args.value;
    console.log(recognition);
}

const updateGrammar = () => {
    const header = document.getElementById("g-header").value;
    const name = document.getElementById("g-name").value;
    const rule = document.getElementById("g-rule").value;
   
    const speechRecognitionList = new webkitSpeechGrammarList();

    speechRecognitionList.addFromString(header + ' ' + name + ' ' + rule, 1)
    recognition.grammars = speechRecognitionList;
    console.log('Setting grammars');
} 


