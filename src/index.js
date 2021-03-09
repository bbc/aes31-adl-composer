/**
 * a module to create ADL(Audio Decision list) AES31 for SADIE - audio editing software
 */
const Timecode = require('smpte-timecode');
const uuid1 = require('uuid/v1');
const moment = require('moment');
/**
 * get time in ISO format
 */
const getCurrentTime = () => {
	return moment().format();
};

/**
 *
 * @param {*} timecode - Timecode object from `smpte-timecode`
 * inspired by from https://stackoverflow.com/questions/31385418/convert-timecode-to-seconds
 */
const tcToSec = (timecode) => {
	const hours = timecode.hours * 60 * 60;
	const minutes = timecode.minutes * 60;
	const seconds = timecode.seconds;
	const frames = timecode.frames * (1 / timecode.frameRate);
	const totalTime = hours + minutes + seconds + frames;

	return totalTime;
};

/**
 * convert seconds to TCF Timecode object from smpte-timecode module
 * TCF assumes this format `HH:MM:SS:FF/0000` where `0000` is optional sample count.
 * @param {*} seconds - Int or float
 * @param {*} frameRate - Float
 */
const secsToTimecode = (seconds, frameRate) => {
	const timeInFrames = seconds * frameRate;
	// Timecode module takes frames, frameRate and drop frame boolean as arguments
	let timecode = new Timecode(timeInFrames, frameRate, false);
	// avoid edge case of trying to subtract a frame from start of sequence
	if (tcToSec(timecode) !== 0) {
		// subtracting one frame to obtain `HH:MM:SS:FF` format
		timecode.subtract(1);
	}
	return timecode;
};

/**
 * @param {*} timecode - Timecode object from `smpte-timecode`
 */
const timecodeToString = (timecode) => {
	return timecode.toString();
};

/**
 * @param {*} timecode - Timecode object from `smpte-timecode`
 */
const timecodeToStringWithSampleCount = (timecode) => {
	return `${timecode.toString()}/0000`;
};

/**
 * deepCopyTimecode
 * For when want to do add or subtract operation on a timecode
 * without modifying the original timecode object
 * @param {*} timecode - Timecode object from `smpte-timecode`
 */
const deepCopyTimecode = (timecode, frameRate, isDropFrame) => {
	return new Timecode(timecodeToString(timecode), frameRate, isDropFrame);
};

const generateGlobalVersion = (
	adlId,
	adlUid,
	verAdlVersion,
	generatorVersion,
	projectOriginator
) => {
	return `
<VERSION>
	(ADL_ID)	${adlId}
	(ADL_UID)	${adlUid}
	(VER_ADL_VERSION)	${verAdlVersion}
	(VER_CREATOR)	"${projectOriginator}"
	(VER_CRTR)	${generatorVersion}
</VERSION>`;
};

const generateGlobalProject = (
	projectName,
	projectOriginator,
	projectCreatedDate
) => {
	return `
<PROJECT>
	(PROJ_TITLE)	"${projectName}"
	(PROJ_ORIGINATOR)	"${projectOriginator}"
	(PROJ_CREATE_DATE)	${projectCreatedDate}
	(PROJ_NOTES)	"_"
	(PROJ_CLIENT_DATA)	"test"
</PROJECT>`;
};

const generateSequence = (sampleRate, frameRate) => {
	return `
<SEQUENCE>
	(SEQ_SAMPLE_RATE)	S${sampleRate}
	(SEQ_FRAME_RATE)	${frameRate}
	(SEQ_ADL_LEVEL)	1
	(SEQ_CLEAN)	FALSE
	(SEQ_DEST_START)	${timecodeToString(new Timecode('00:00:00:00'))}/0000
</SEQUENCE>`;
};

const generateSource = (index, filePath, fileName, uuid) => {
	return `	(Index)	${index}	(F)	"URL:file://${filePath}/${fileName}"	${uuid}	_	_	"_"	"_"`;
};

const generateSourceIndex = (filePaths, fileNames) => {
	const defaultFullPath = 'localhost/C:/Audio Files';
	const defaultSourceUUID = 'BBCSPEECHEDITOR';
	const tracks = filePaths.map((path, i) => {
		const index = i + 1;
		const uuid = `${defaultSourceUUID}${index}`;
		return generateSource(index, defaultFullPath, fileNames[path], uuid);
	});

	return `
<SOURCE_INDEX>
${tracks.join('\n')}
</SOURCE_INDEX>`;
};

const generateEvent = (
	index,
	pathIndex,
	srcInTimecode,
	destInTimecode,
	destOutTimecode,
	label
) => {
	return `	(Entry)	${index}	(Cut)	I	${pathIndex}	1~2	1~2	${srcInTimecode}	${destInTimecode}	${destOutTimecode}	_	(Rem) NAME "${label}"`;
};

const generateEventList = (edits, frameRate, filePaths) => {
	let projectTime = new Timecode('00:00:00:00');

	const eventEntries = edits.map((edit, index) => {
		const destIn = deepCopyTimecode(projectTime, frameRate, false);
		const srcIn = secsToTimecode(edit['start'], frameRate);
		const srcOut = secsToTimecode(edit['end'], frameRate);
		const destOut = deepCopyTimecode(projectTime, frameRate, false).add(srcOut.subtract(srcIn));

		projectTime = destOut;
		const path = edit.path ? edit.path: edit.clipName;

		return generateEvent(
			index + 1,
			filePaths.indexOf(path) + 1,
			timecodeToStringWithSampleCount(srcIn),
			timecodeToStringWithSampleCount(destIn),
			timecodeToStringWithSampleCount(destOut),
			edit['label']
		);
	});

	return `
<EVENT_LIST>
${eventEntries.join('\n')}
</EVENT_LIST>
`;
};

const generateEDL = ({
	projectOriginator = 'Default Unspecified Project Originator',
	edits,
	filePaths,
	fileNames,
	sampleRate,
	frameRate,
	projectName,
	adlUid = uuid1(),
	projectCreatedDate = getCurrentTime(),
}) => {
	const generatorVersion = '00.01';
	const verAdlVersion = '01.02';
	const adlId = '1234';

	const version = generateGlobalVersion(
		adlId,
		adlUid,
		verAdlVersion,
		generatorVersion,
		projectOriginator
	);
	const project = generateGlobalProject(
		projectName,
		projectOriginator,
		projectCreatedDate
	);
	const sequence = generateSequence(sampleRate, frameRate);
	const sourceIndex = generateSourceIndex(filePaths, fileNames);
	const eventList = generateEventList(edits, frameRate, filePaths);
	const adl = `<ADL>
${version}
${project}
${sequence}
${sourceIndex}
${eventList}
</ADL>
`;
	return adl;
};


const getFileList = (edits) => {
	const fileNames = edits.reduce((res, edit) => {
		const path = edit.path ? edit.path : edit.clipName;
		res[path] = edit.clipName;
		return res;
	}, {});
	const filePaths = Object.keys(fileNames);
	return { filePaths, fileNames };
};

const writeEDL = ({
	projectOriginator,
	edits,
	sampleRate,
	frameRate,
	projectName,
	adlUid,
	projectCreatedDate,
}) => {
	const { filePaths, fileNames } = getFileList(edits);
	const edl = generateEDL({
		edits,
		projectOriginator,
		filePaths,
		fileNames,
		sampleRate,
		frameRate,
		projectName,
		adlUid,
		projectCreatedDate,
	});

	// NOTE: in the python version the audio is included in the ADL via zipping etc.. altho not needed for client side use
	// SADiE will use the audio present in the workspace if not provided with the file

	return edl;
};

module.exports = writeEDL;
