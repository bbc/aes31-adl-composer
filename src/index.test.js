const fs = require('fs');
const writeEDL = require('./index.js');
const sampleEdits = require('../sample-data/sample-input/edits.json');

// const expectedADLOutput = fs.readFileSync('./src/mock/example-output.adl').toString();
const expectedADLOutput = require('./mock/example-output-adl');

describe('ADL Output testing', () => {
	it('Should be defined', ( ) => {
		const result = writeEDL({
			projectOriginator: 'Digital Paper Edit',
			edits: sampleEdits,
			// https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
			sampleRate: '44100',
			frameRate: 25,
			projectName: 'Node Example'
		});
		expect(result).toBeDefined();
	});
	test('Testing output', () => {
		const result = writeEDL({
			projectOriginator: 'Digital Paper Edit',
			edits: sampleEdits,
			// https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate
			sampleRate: '44100',
			frameRate: 25,
			projectName: 'Node Example'
		});
		expect(result).toEqual(expectedADLOutput);
	});

});