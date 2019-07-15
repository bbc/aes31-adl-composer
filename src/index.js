/**
* a module to create ADL(Audio Decision list) AES31 for SADIE - audio editing software 
*/
const Timecode = require('smpte-timecode');
const uuid1 = require('uuid/v1');
const moment = require('moment');

// Temporary helper function for python to js conversion
const str = (string) =>{
	return string;
};

/**
 * helper function to convert a set to an array
 * @param {*} set - a js Set - data structure object
 */
const convertSetToArray = (set)=>{
	return [...set];
};

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
const tcToSec = (timecode) =>{
	const hours   = timecode.hours * 60 * 60;
	const minutes = timecode.minutes * 60;
	const seconds = timecode.seconds;
	const frames  = timecode.frames *(1/timecode.frameRate);
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
	if(tcToSec(timecode)!== 0){
		// subtracting one frame to obtain `HH:MM:SS:FF` format
		timecode.subtract(1);
	}
	return timecode;
};

/**
 * @param {*} timecode - Timecode object from `smpte-timecode` 
 */
const timecodeToString = (timecode)=>{
	return timecode.toString();
};

/**
 * @param {*} timecode - Timecode object from `smpte-timecode` 
 */
const timecodeToStringWithSampleCount = (timecode)=>{
	return `${timecode.toString()}/0000`;
};

/**
 * deepCopyTimecode
 * For when want to do add or subtract operation on a timecode 
 * without modifying the original timecode object
 * @param {*} timecode - Timecode object from `smpte-timecode` 
 */
const deepCopyTimecode = (timecode, frameRate, isDropFrame)=>{
	return new Timecode(timecodeToString(timecode),frameRate, isDropFrame);
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
	projectCreatedDate =  getCurrentTime()
}) => {
	const  generatorVersion='00.01';
	let  projectTime= new Timecode('00:00:00:00');
	let   edl='';
	const verAdlVersion = '01.02';
	const adlId = '1234';

	/**
     * write header
     */
	edl += '<ADL>\n\n';

	/**
     * global version information
     */
	edl += '<VERSION>\n'+
    '\t(ADL_ID)\t'+adlId+'\n'+
    '\t(ADL_UID)\t'+adlUid+'\n'+
    '\t(VER_ADL_VERSION)\t'+verAdlVersion+'\n'+
    '\t(VER_CREATOR)\t"'+projectOriginator+'"\n'+
    '\t(VER_CRTR)\t'+generatorVersion+'\n'+
    '</VERSION>\n\n';

	/**
     * global project information
     */
	edl += '<PROJECT>\n'+
    '\t(PROJ_TITLE)\t"'+projectName+'"\n'+
    '\t(PROJ_ORIGINATOR)\t"'+projectOriginator+'"\n'+
    '\t(PROJ_CREATE_DATE)\t'+projectCreatedDate+'\n'+
    '\t(PROJ_NOTES)\t"_"\n'+
    '\t(PROJ_CLIENT_DATA)\t"test"\n'+
    '</PROJECT>\n\n';

	/**
     * global sequence information
     */
	edl += '<SEQUENCE>\n'+
        '\t(SEQ_SAMPLE_RATE)\tS'+str(sampleRate)+'\n'+
        '\t(SEQ_FRAME_RATE)\t'+str(frameRate)+'\n'+
        '\t(SEQ_ADL_LEVEL)\t1\n'+
        '\t(SEQ_CLEAN)\tFALSE\n'+
        '\t(SEQ_DEST_START)\t'+str(timecodeToString(projectTime))+'/0000\n'+
            '</SEQUENCE>\n\n';

	/**
     * file locations
     * @todo: is this needed? I don't fully understand what this does
	 * @todo: should probably be unique file path names
     */ 
	edl+='<SOURCE_INDEX>\n';
	convertSetToArray(filePaths).forEach((path, i)=>{
		const index = i+1;
		edl+='\t(Index)\t'+str(index)+'\t(F)\t"URL:file://localhost/C:/Audio Files/'+ fileNames[path] +'"\tBBCSPEECHEDITOR'+str(index)+'\t_\t_\t"_"\t"_"\n';
		
	});
	edl+='</SOURCE_INDEX>\n\n';

	/**
     *  edits
     */
	edl+= '<EVENT_LIST>\n';
	// TODO: loop over edits
	edits.forEach((edit, i)=>{
		const index = i+1;
		const srcIn = secsToTimecode(edit['start'],frameRate);
		const srcOut = secsToTimecode(edit['end'],frameRate);
		const srcLen = srcOut.subtract(srcIn);
		const destIn = deepCopyTimecode(projectTime, frameRate, false);
		const destOut = deepCopyTimecode(projectTime, frameRate, false).add(srcLen);
		edl+='\t(Entry)\t'+str(index)+'\t'+
			'(Cut)\tI\t'+str(convertSetToArray(filePaths).indexOf(edit['path'])+1)+'\t'+
            '1~2\t1~2\t'+
            str(timecodeToStringWithSampleCount(srcIn))+'\t'+str(timecodeToStringWithSampleCount(destIn) )+'\t'+str(timecodeToStringWithSampleCount(destOut))+'\t_'+
            '\t(Rem) NAME "'+edit['label']+'"\n';
		projectTime = destOut;
	});

	edl+= '</EVENT_LIST>\n\n';

	/**
     * write footer
     */
	edl+= '</ADL>\n';

	return edl;
};

const getFileList = (edits) =>{
	const filePaths = new Set();
	const fileNames = {};
	// if the edits don't have a path attribute
	// use clipName as path
	edits = edits.map((edit)=>{
		if(!edit.path){
			edit.path = edit.clipName;
		}
		return edit;
	});

	edits.forEach((edit)=>{
		filePaths.add(edit.path);
		fileNames[edit.path] = edit.clipName;
	});
	
	return {filePaths, fileNames};
};

const writeEDL = ({ projectOriginator, edits, sampleRate, frameRate, projectName, adlUid, projectCreatedDate}) =>{
	const {filePaths, fileNames} = getFileList(edits);
	const edl = generateEDL({edits, projectOriginator, filePaths, fileNames, sampleRate, frameRate, projectName, adlUid, projectCreatedDate});
	
	// NOTE: in the python version the audio is included in the ADL via zipping etc.. altho not needed for client side use
	// SADiE will use the audio present in the workspace if not provided with the file

	return edl;

};

module.exports = writeEDL;