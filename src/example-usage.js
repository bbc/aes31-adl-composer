const fs = require('fs');
const generateEDL = require('./index.js');
const sampleEdits = require('../sample-data/sample-input/edits.json');

const result = generateEDL({
	projectOriginator: 'Digital Paper Edit',
	edits: sampleEdits,
	filePaths: [ '/some/path/to/the/file/1', '/some/path/to/the/file/2' ],
	// fileNames,
	// https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
	sampleRate: '44100',
	frameRate: 25,
	projectName: 'Test edit 1'
});

fs.writeFileSync('./sample-data/sample-output/example-output.adl.edl', result);
console.log(result);
