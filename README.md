# NWizard
This is a cross platform wizard framework for desktop. It is made by NW.js and combined with some modern front-end technologies that I feel best fit for a wizard. 
Wizard management is based on Html 5 import and jquery.steps. I have written some functions to make the wizard management work extremely easy.
Mulit-language support is through hogan template engine.
This framework is capable for calling external application in sync or async ways. Working with local file system. Managing the network... Thanks to the power of Node.js.

## Installation
git clone http://github.com/ricemouse/nwizard.git

## To compile

```
cd nwizard
npm install
cd app/spi
bower install
gulp (optional, used to build executable binary files, but still not reliable)
```
## To run
install nwjs latest version
and then run
```
nw ./app
```