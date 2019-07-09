#!/usr/bin/env python3
import edl2aes31
import json

# read file
with open('../sample-data/sample-input/edits.json', 'r') as myfile:
    data=myfile.read()

# parse file
edits = json.loads(data)

print(edits)


# print(edl2aes31.getCurrentTime())

# timecodeConversion = edl2aes31.secsToTCF(100, 25)
# print(timecodeConversion)

# edits =  [{ "start": 3, "end":30, "filename":"audioFileName.wav", "path": "some/path/to/audio/file", "label":""}]
# edits = json.loads(editsString)
# print(edits[0]['start'])
# edits, filePaths, fileNames, sampleRate, frameRate, projectName
# filePaths=[""]
# fileNames=[{"some/path/to/audio/file":"filename1.wav"},{"some/path/to/audio/file2":"filename2.wav"}] #  "some/path/to/audio/file2", "filename2.wav"
# edlExample =  edl2aes31.generateEDL(edits, filePaths, fileNames, 44100, 24, 'some project title')
# print(edlExample)

# writePath, edits, sampleRate, frameRate, projectName, includeAudio
edl2aes31.writeEDL('../sample-data/sample-output/example-output-adl-python.adl', edits, 44100, 25, 'Python Example', False)