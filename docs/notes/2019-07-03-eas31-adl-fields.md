# eas31 ADL fields
Some notes around the various attributes fields needed in aes31 ADL (audio decision list)

```xml
<ADL>

<VERSION>
	(ADL_ID)	1234
	(ADL_UID)	85d459f0-9d7d-11e9-a092-dbf78d6023f2
	(VER_ADL_VERSION)	01.02
	(VER_CREATOR)	"Digital Paper Edit"
	(VER_CRTR)	00.01
</VERSION>

<PROJECT>
	(PROJ_TITLE)	"Test edit 1"
	(PROJ_ORIGINATOR)	"Digital Paper Edit"
	(PROJ_CREATE_DATE)	2019-07-03T10:30:05.327Z
	(PROJ_NOTES)	"_"
	(PROJ_CLIENT_DATA)	"test"
</PROJECT>

<SEQUENCE>
	(SEQ_SAMPLE_RATE)	S44100
	(SEQ_FRAME_RATE)	25
	(SEQ_ADL_LEVEL)	1
	(SEQ_CLEAN)	FALSE
	(SEQ_DEST_START)	0/0000
</SEQUENCE>

<SOURCE_INDEX>
	(Index)	1	(F)	"URL:file://localhost/C:/Audio Files/filename1.wav"	BBCSPEECHEDITOR1	_	_	"_"	"_"
	(Index)	2	(F)	"URL:file://localhost/C:/Audio Files/filename2.wav"	BBCSPEECHEDITOR2	_	_	"_"	"_"
</SOURCE_INDEX>

<EVENT_LIST>
	(Entry)	1	(Cut)	I	filename1.wav	1~2	1~2	00:00:30:00/0000	00:00:00:00/0000	00:00:05:00/0000	_	(Rem) NAME "not sure what this is for?"
	(Entry)	2	(Cut)	I	filename2.wav	1~2	1~2	00:00:36:00/0000	00:00:05:00/0000	00:00:06:00/0000	_	(Rem) NAME "not sure what this is for?"
</EVENT_LIST>

</ADL>
```

## `VERSION`
seems to be info about the version of the project/sequence for SADiE?

## `PROJECT`

seems to be info about the specs of the project for SADiE?

## `SEQUENCE`
seems to be info about the specs of the sequence for SADiE?

## `SOURCE_INDEX`

From Chris: 
>the spec for AES31 points to a specific file in the file system (e.g. C:/folder/file), but obviously we don't know where it is. SADiE looks for the filename in the current project directory.

TODO: these should probably be unique, eg if the clip is referenced more then once in `EVENT_LIST` it can probably been listed only once in the `SOURCE_INDEX`. But not sure if it's a hard requirement, eg if it would break if listed more then once?

## `EVENT_LIST`
This is the core of the ADL - Audio Decision List, instructions

`(Rem) NAME` are labels for SADiES clip 

From Chris
>you can add a label to each clip that will appear in the DAW, You can feed it an empty string if you like.

This means we could add labels to clips into SADiE programmatically. Eg from DPE labels highlights into SADiE.


## Usage

From Chris
>I think if they create a project in Sadie, pull in the audio files, then import the AES31 file, it _might_ work