##
# AES31 authoring tool
#
# Writes an AES31-compatible edit decision list to disk. Can also create a ZIP
# package with the EDL and audio file. The output is compatible with SADiE.
#
# Edits are defined as a list of dicts with the following attributes:
# - start    [float]    start time
# - end      [float]    end time
# - filename [string]   audio filename
# - path     [string]   path to audio file
# - label    [string]   label for edit
#
# ----------------------
#
# Copyright (c) 2015 British Broadcasting Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 

from datetime import datetime, timezone
from uuid import uuid1
from timecode import Timecode
from os.path import basename
from zipfile import ZipFile, ZIP_STORED

# get time in ISO format
def getCurrentTime():
    time=datetime.now(timezone.utc).replace(microsecond=0)
    return time.isoformat()

# convert seconds to timecode
def secsToTCF(secs, fr):
    return Timecode(fr, start_seconds=secs)

def getFileList(edits):
    filePaths = set()
    fileNames = {}
    for edit in edits:
        filePaths.add(edit['path'])
        fileNames[edit['path']] = edit['filename']
    return list(filePaths), fileNames

def generateEDL(edits, filePaths, fileNames, sampleRate, frameRate, projectName):

    # set up variables
    if not isinstance(sampleRate, int):
        raise Exception('Sample rate must be an integer')
    if not isinstance(frameRate, int) and not isinstance(frameRate, float):
        raise Exception('Frame rate must be a number')

    generatorName='BBC Speech Editor'
    generatorVersion='00.01'
    projectTime=Timecode(frameRate, '00:00:00:00')
    edl=""

    # write header
    edl=(edl+
    '<ADL>\n\n')

    # global version information
    edl=(edl+
    '<VERSION>\n'+
    '\t(ADL_ID)\t1234\n'+
    '\t(ADL_UID)\t'+str(uuid1())+'\n'+
    '\t(VER_ADL_VERSION)\t01.02\n'+
    '\t(VER_CREATOR)\t"'+generatorName+'"\n'+
    '\t(VER_CRTR)\t'+generatorVersion+'\n'+
    '</VERSION>\n\n')

    # global project information
    edl=(edl+
    '<PROJECT>\n'+
    '\t(PROJ_TITLE)\t"'+projectName+'"\n'+
    '\t(PROJ_ORIGINATOR)\t"'+generatorName+'"\n'+
    '\t(PROJ_CREATE_DATE)\t'+getCurrentTime()+'\n'+
    '\t(PROJ_NOTES)\t"_"\n'+
    '\t(PROJ_CLIENT_DATA)\t"test"\n'+
    '</PROJECT>\n\n')

    # global sequence information
    edl=(edl+
    '<SEQUENCE>\n'+
    '\t(SEQ_SAMPLE_RATE)\tS'+str(sampleRate)+'\n'+
    '\t(SEQ_FRAME_RATE)\t'+str(frameRate)+'\n'+
    '\t(SEQ_ADL_LEVEL)\t1\n'+
    '\t(SEQ_CLEAN)\tFALSE\n'+
    '\t(SEQ_DEST_START)\t'+str(projectTime)+'/0000\n'+
    '</SEQUENCE>\n\n')

    # file locations
    edl=(edl+
    '<SOURCE_INDEX>\n')
    index=1
    for path in filePaths:
        edl=(edl+
        '\t(Index)\t'+str(index)+
        '\t(F)\t"URL:file://localhost/C:/Audio Files/'+fileNames[path]+'"\tBBCSPEECHEDITOR'+str(index)+'\t_\t_\t"_"\t"_"\n')
        index=index+1
    edl=(edl+
    '</SOURCE_INDEX>\n\n')

    # edits
    edl=(edl+
    '<EVENT_LIST>\n')
    index=1
    for edit in edits:
        if edit['end'] < edit['start']:
            raise Exception('Start time cannot be before end time.')
        srcIn=secsToTCF(edit['start'],frameRate)
        srcOut=secsToTCF(edit['end'],frameRate)
        srcLen=srcOut-srcIn
        destIn=projectTime
        destOut=projectTime+srcLen

        edl=(edl+
        '\t(Entry)\t'+str(index)+'\t'+
        '(Cut)\tI\t'+str(filePaths.index(edit['path'])+1)+'\t'+
        '1~2\t1~2\t'+
        str(srcIn)+'/0000\t'+str(destIn)+'/0000\t'+str(destOut)+'/0000\t_'+
        '\t(Rem) NAME "'+edit['label']+'"\n')

        index=index+1
        projectTime=destOut
    edl=(edl+
    '</EVENT_LIST>\n\n')

    # write footer
    edl=(edl+
    '</ADL>\n')

    return edl

def writeEDL(writePath, edits, sampleRate, frameRate, projectName, includeAudio):
    filePaths, fileNames = getFileList(edits)
    edl = generateEDL(edits, filePaths, fileNames, sampleRate, frameRate, projectName)

    if includeAudio:
        with ZipFile(writePath, 'w') as zipout:
            zipout.writestr(projectName+'.adl', edl)
            for path in filePaths:
                try:
                    zipout.write(path, 'Audio Files/'+fileNames[path], ZIP_STORED)
                except FileNotFoundError:
                    raise Exception("ERROR: Audio file \""+path+"\" does not exist.")
    else:
        with open(writePath, 'w') as file:
            file.write(edl)
