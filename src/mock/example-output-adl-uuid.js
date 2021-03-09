const adl = `<ADL>

<VERSION>
	(ADL_ID)	1234
	(ADL_UID)\t${'d5edc550-a707-11e9-aa11-d78f5cf5aad5'}
	(VER_ADL_VERSION)	01.02
	(VER_CREATOR)	"Digital Paper Edit"
	(VER_CRTR)	00.01
</VERSION>

<PROJECT>
	(PROJ_TITLE)	"Node Example"
	(PROJ_ORIGINATOR)	"Digital Paper Edit"
	(PROJ_CREATE_DATE)\t${'2019-07-15T14:52:50+01:00'}
	(PROJ_NOTES)	"_"
	(PROJ_CLIENT_DATA)	"test"
</PROJECT>

<SEQUENCE>
	(SEQ_SAMPLE_RATE)	S44100
	(SEQ_FRAME_RATE)	25
	(SEQ_ADL_LEVEL)	1
	(SEQ_CLEAN)	FALSE
	(SEQ_DEST_START)	00:00:00:00/0000
</SEQUENCE>

<SOURCE_INDEX>
	(Index)	1	(F)	"URL:file://localhost/C:/Video Files/filename0.wav"	BBCSPEECHEDITOR1	_	_	"_"	"_"
	(Index)	2	(F)	"URL:file://localhost/D:/Video Files/filename1.wav"	uuid1	_	_	"_"	"_"
	(Index)	3	(F)	"URL:file://localhost/C:/Audio Files/filename2.wav"	uuid2	_	_	"_"	"_"
	(Index)	4	(F)	"URL:file://localhost/C:/Audio Files/filename3.wav"	uuid3	_	_	"_"	"_"
	(Index)	5	(F)	"URL:file://localhost/C:/Audio Files/filename4.wav"	BBCSPEECHEDITOR2	_	_	"_"	"_"
</SOURCE_INDEX>

<EVENT_LIST>
	(Entry)	1	(Cut)	I	1	1~2	1~2	00:00:09:24/0000	00:00:00:00/0000	00:00:10:00/0000	_	(Rem) NAME "undefined"
	(Entry)	2	(Cut)	I	2	1~2	1~2	00:00:19:24/0000	00:00:10:00/0000	00:00:20:00/0000	_	(Rem) NAME "Label1"
	(Entry)	3	(Cut)	I	3	1~2	1~2	00:00:29:24/0000	00:00:20:00/0000	00:00:30:00/0000	_	(Rem) NAME "Label2"
	(Entry)	4	(Cut)	I	4	1~2	1~2	00:00:49:24/0000	00:00:30:00/0000	00:00:40:00/0000	_	(Rem) NAME "Label3"
	(Entry)	5	(Cut)	I	3	1~2	1~2	00:01:09:24/0000	00:00:40:00/0000	00:00:50:00/0000	_	(Rem) NAME "Label2"
	(Entry)	6	(Cut)	I	5	1~2	1~2	00:01:09:24/0000	00:00:50:00/0000	00:01:00:00/0000	_	(Rem) NAME "Label4"
</EVENT_LIST>

</ADL>
`;

module.exports = adl;