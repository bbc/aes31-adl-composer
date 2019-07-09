#!/usr/bin/env python3
import edl2aes31
import json

# read edits json file
with open('../sample-data/sample-input/edits.json', 'r') as myfile:
    data=myfile.read()

# parse edits json file
edits = json.loads(data)
# convert and write to disk
edl2aes31.writeEDL('../sample-data/sample-output/example-output-adl-python.adl', edits, 44100, 25, 'Python Example', False)