# AES31 ADL Composer

_Work in progress_ 

A node module to convert a json sequence into an AES31 ADL (audio decision list) compatible with SADiE audio editing software. 

Originally from [BBC R&D Chris Baume python version, as part of BBC Dialogger/Discourse text based video editing project](https://github.com/bbc/edl-convert/blob/master/edl2aes31.py)

## Setup
<!-- _stack - optional_
_How to build and run the code/app_ -->

<!-- git clone  -->

cd, npm install

## Usage - development 
<!-- TBC publish to npm -->
<!-- requrie module and -->
see example usage for example

## Usage - production

```
npm install @bbc/aes31-adl-composer
```

require or import in your code and see example usage for more details

## System Architecture
<!-- _High level overview of system architecture_ -->

Originally converted from Chris Baume python code, see [`python-version/edl2aes31.py`](./ython-version/edl2aes31.py)

## Development env
 <!-- _How to run the development environment_
_Coding style convention ref optional, eg which linter to use_
_Linting, github pre-push hook - optional_ -->

- [ ] npm > `6.1.0`
- [ ] node v 10 - [lts/dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)
- [ ] see [`.eslintrc`](./.eslintrc) in the various packages for linting rules

Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc)

## Build
<!-- _How to run build_ -->

<!-- TBC might not need transpiling -->

_TBC_

## Tests
<!-- _How to carry out tests_ -->

<!-- TBC using jest -->
<!-- npm run test -->

_TBC_

## Deployment
<!-- _How to deploy the code/app into test/staging/production_ -->

<!-- TBC onto NPM -->
<!-- npm run publish  -->

To publish to npm 
```
npm run publish:public
```