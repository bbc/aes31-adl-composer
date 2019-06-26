/**
* a module to create ADL(Audio Decision list) AES31 for SADIE - audio editing software 
*/
const timecodesFromSeconds = require('node-timecodes').fromSeconds;
const uuid1 = require('uuid/v1');

// Temporary helper function for python to js conversion
const str = (string) =>{
	return string;
};

/**
 * get time in ISO format
 */
const getCurrentTime = () => {
	// https://www.digitalocean.com/community/tutorials/understanding-date-and-time-in-javascript
	const event = new Date();
	return event.toISOString();
};

/**
 * convert seconds to timecode
 */
const secsToTCF = (seconds, frameRate) => {
	// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	//   const date = new Date(seconds);
	//   const timeString = date.toISOString().substr(11, 12);
	//   return timeString;
	return timecodesFromSeconds(seconds, { frameRate });
};

const generateEDL = ({
	projectOriginator,
	edits,
	filePaths,
	// fileNames,
	sampleRate,
	frameRate,
	projectName
}) => {

	const generatorName = projectOriginator ? projectOriginator : 'Default Unspecified Project Originator';
	const  generatorVersion='00.01';
	let  projectTime=secsToTCF('00:00:00:00', frameRate);
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
    '\t(ADL_UID)\t'+str(uuid1())+'\n'+
    '\t(VER_ADL_VERSION)\t'+verAdlVersion+'\n'+
    '\t(VER_CREATOR)\t"'+generatorName+'"\n'+
    '\t(VER_CRTR)\t'+generatorVersion+'\n'+
    '</VERSION>\n\n';

	/**
     * global project information
     */
	edl += '<PROJECT>\n'+
    '\t(PROJ_TITLE)\t"'+projectName+'"\n'+
    '\t(PROJ_ORIGINATOR)\t"'+generatorName+'"\n'+
    '\t(PROJ_CREATE_DATE)\t'+getCurrentTime()+'\n'+
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
        '\t(SEQ_DEST_START)\t'+str(projectTime)+'/0000\n'+
            '</SEQUENCE>\n\n';


	/**
     * file locations
     * @todo: is this needed? I don't fully understand what this does
     */ 
	// edl+='<SOURCE_INDEX>\n';
	// filePaths.forEach((filePath, i)=>{
	//     const index = i+1;
	//     edl+='\t(Index)\t'+str(index)+
	//     // especially this line?
	//     '\t(F)\t"URL:file://localhost/C:/Audio Files/'+fileNames[path]+'"\tBBCSPEECHEDITOR'+str(index)+'\t_\t_\t"_"\t"_"\n';
	// });
	// edl+='</SOURCE_INDEX>\n\n';

	// >you could easily adapt it to client side if you don't package the audio files with it. 
	// > It's just some XML-type thing.

	/**
     *  edits
     */
	edl+= '<EVENT_LIST>\n';
	// TODO: loop over edits
	edits.forEach((edit, i)=>{
		const index = i+1;
		const srcIn=secsToTCF(edit['start'],frameRate);
		const srcOut=secsToTCF(edit['end'],frameRate);
		const srcLen=srcOut-srcIn;
		const destIn=projectTime;
		const destOut=projectTime+srcLen;

		edl+='\t(Entry)\t'+str(index)+'\t'+
            '(Cut)\tI\t'+str(filePaths.indexOf(edit['path'])+1)+'\t'+
            '1~2\t1~2\t'+
            str(srcIn)+'/0000\t'+str(destIn)+'/0000\t'+str(destOut)+'/0000\t_'+
            '\t(Rem) NAME "'+edit['label']+'"\n';
		projectTime=destOut;
	});

	edl+= '</EVENT_LIST>\n\n';

	/**
     * write footer
     */
	edl+= '</ADL>\n';

	return edl;
};
//////////////////////
module.exports = generateEDL;