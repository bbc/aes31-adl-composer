const fs = require('fs');
const writeEDL = require('./index.js');
const sampleEdits = require('../sample-data/sample-input/edits.json');

// const result = generateEDL({
// 	projectOriginator: 'Digital Paper Edit',
// 	edits: sampleEdits,
// 	// https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
// 	sampleRate: '44100',
// 	frameRate: 25,
// 	projectName: 'Node Example'
// });

const result = writeEDL({
	projectOriginator: 'Digital Paper Edit',
	edits: sampleEdits,
	// https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
	sampleRate: '44100',
	frameRate: 25,
	projectName: 'Node Example'
});



fs.writeFileSync('./sample-data/sample-output/example-output.adl', result);
console.log(result);
