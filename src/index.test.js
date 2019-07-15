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
			sampleRate: '44100',
			frameRate: 25,
			projectName: 'Node Example'
		});
		expect(result).toBeDefined();
	});
    
	it('Testing output', () => {
		const result = writeEDL({
			projectOriginator: 'Digital Paper Edit',
			edits: sampleEdits,
			adlUid: 'd5edc550-a707-11e9-aa11-d78f5cf5aad5',
			projectCreatedDate:'2019-07-15T14:52:50+01:00',
			sampleRate: '44100',
			frameRate: 25,
			projectName: 'Node Example'
		});
		expect(result).toEqual(expectedADLOutput);
	});

});