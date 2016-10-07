
// Sets a property to the specified value
// varName - string - property name
// docTop - document - the document in which the property should be set
// value - the value to set the property to
// returns - boolean - success of the set operation
function assignProperty(varName, docTop, value)
{    
    return assignValue(docTop, docTop.document.properties, varName, varName, value, false) ;
}

// retrieve a resource property
// varName: string - resource ID
// docTop: document - staring child document to use for inheritance
// defaultValue: string - optional value to use if the resource cannot be found
// returns string or [] - resource value
function findProperty(varName,docTop,defaultValue) {
    var v;
    try {
        var p = docTop;
        var arrayIndex = null;
        do {
            var i = varName.indexOf('[');
            if (i > 0) {
                var j = varName.lastIndexOf(']');
                if (j > i) {
                    arrayIndex = varName.substring(i+1,j);
                    varName = varName.substring(0,i);
                }
            }
            try { v = p.document.properties[varName];} catch(e) {
            }
            if (typeof v != "undefined") {
                // varName exists, determine if it is an array
                if (typeof v == "object" && arrayIndex != null) {
                    i = arrayIndex.indexOf('[');
                    while (i > 0 && (typeof v == "object")) {
                        var j = arrayIndex.lastIndexOf(']');
                        if (j > i) {
                            v = v[arrayIndex.substring(0,i)];
                            arrayIndex = arrayIndex.substring(i+1,j);
                            i = arrayIndex.indexOf('[');
                        } else
                            i = -1;
                    }
                    if (typeof v == "object")
                        v = v[arrayIndex];
                }
                break;
            }
            if (p.parent == p) p = null;
            else
                p = p.parent;
        } while (p != null);

    } catch(e) {
        v = top.UNDEFINED;
        top.logException(e,arguments); 
    }
    
    if (typeof v == "undefined") {
        v = defaultValue;
        if (typeof v == "undefined") {
            top.logMessage("LPV20024W",varName);
            v = "** "+varName+" - NO PROPERTY **";
        }
    }
    return v;
}

// private helper function to combine text lines that end with \
function combineContinuedLines(arrayOfLines) {
    try {
        for (var index = arrayOfLines.length-2; index >= 0; index--) {
            if (arrayOfLines[index].length > 0)
                if (arrayOfLines[index].charAt(arrayOfLines[index].length-1) == "\\") {
                    arrayOfLines[index] = arrayOfLines[index].substring(0,arrayOfLines[index].length-1) + arrayOfLines[index+1];
                    arrayOfLines.splice(index+1, 1);
                }
        }
    } catch(e) {
        top.logException(e,arguments);
    }
}

// store key/value pair into array
// fileName: string - property file name used for logging
// array: [] - property array
// key: string - resource ID
// value: string or [] - resource value
// isFallBackLocale: boolean - won't overwrite if true
// returns void
function assignValue(fileName, array, origkey, key, value, isFallBackLocale) {

    var success = true;

    try {
        try {
            var i = key.indexOf("[");
            if (i > 0 && (key.length-2) > i && key.charAt(key.length-1) == "]") {
                var arrayIndex = top.trim(key.substring(i+1,key.length-1));
                key = top.trim(key.substring(0,i));
                var a = null;
                if (typeof array[key] == "undefined") {
                    array[key] = new Array();
                } else if (typeof array[key] == "string") {
                    top.logMessage("LPV20003S", fileName, key);
                    success = false;
                }
                return assignValue(fileName, array[key], origkey, arrayIndex, value, isFallBackLocale);
            } else {
                if (isFallBackLocale && (typeof array[key] == "undefined")) {
                    top.logMessage("LPV20006W", fileName, origkey);
                    success = false;
                }
                if (!isFallBackLocale || (typeof array[key] == "undefined")) {
                    array[key] = value;
                }
            }
        } catch(e) {
            top.logMessage("LPV20004S", fileName, e.message, key);
            success = false;
        }
    } catch(e) {
        top.logException(e,arguments);
    }

    return success;
}

// private helper function to parse resource file lines into key/value pairs
function getKeyValuePairs(fileName, arrayOfLines, propertiesArray, isFallBackLocale) {
    try {
        var index = 0;
        while (index < arrayOfLines.length) {
            var curLine= top.trim(arrayOfLines[index]);
            // Ignore blank lines and comments
            if ((curLine.length == 0) || (curLine.substr(0,2) == '//') ||
                (curLine.charAt(0) == '#') || (curLine.charAt(0) == '!') || (curLine.charAt(0) == ':') ) {
                index++;
                continue;
            }

            var eq = 0;
            var colon = curLine.indexOf(":");
            var equals = curLine.indexOf("=");
            if (equals > 0 && colon < 0) {
                eq = equals;
            }
            if (colon > 0 && equals < 0) {
                eq = colon;
            }
            if (colon > 0 && equals > 0) {
                if (equals < colon) {
                    eq = equals;
                }
                if (colon < equals) {
                    eq = colon;
                }
            }
            if (colon == -1 && equals == -1) {
                eq = -1;
            }
            if (eq > 0) {
                // Get key part
                var key = top.trim(curLine.substring(0,eq));
                if (key.length > 0) {
                    // Get value part
                    var value = top.trim(curLine.substring(eq+1));
                    // find the next line with at least 1 character for the delimiter
                    while (value.length == 0 && index < (arrayOfLines.length-1)) {
                        index++;
                        value = top.trim(arrayOfLines[index]);
                    }
                    if (value.length > 0) {
                        var originalValue = value;
                        var endIndex = 0;
                        var delim = value.charAt(0);
                        var endDelim = delim;
                        if (delim == '[' && value.charAt(value.length - 1) == ']') {
                            endDelim = ']';
                        }
                        //The property has a known delimiter, so strip the delimiters off and continue processing
                        if (delim == '"' || delim == "'" || (delim == '[' && endDelim == ']')) {
                            
                            var endRE = new RegExp("\\"+endDelim+"\\s*;?\\s*(#|//|/\\*.*\\*/\\s*$|$)");
                            endIndex=value.search(endRE);
                            if (endIndex == -1) {
                                top.logMessage("LPV20005S", fileName, delim, key);
                            }
                            else {
                                value = value.substring(1,endIndex);
                            }                      
                        }
                        //process a property with a ' or " delimiter
                        if (delim == '"' || delim == "'") {
                            if (endIndex >= 0) {
                                var startRE = new RegExp("\n[^=]+\\s*=\\s*\\"+delim);
                                value = value.substring(0,endIndex);
                                if (value.search(startRE) >= 0)
                                    top.logMessage("LPV20005S", fileName, delim, key);
                            } else {
                                top.logMessage("LPV20005S", fileName, delim, key);
                            }                            
                        }
                        //process an array property
                        if (delim == '[' && endDelim == ']') {
                            try {
                                value = value.substring(0,endIndex);
                                eval('value = ['+value+']');
                            //if there is an exception we want to see if it is a bad array or a valid string
                            //a bad array for example would be [value], arrays should be written as such ['value1','value2']
                            //a valid string for example would [%1] some text here ending in ], although it is wrapped in [ ] this is not meant to be an array
                            } catch(e) {
                                var validString = true;
                                var stackCtr = 0;
                                for (var i = 0; i < originalValue.length; i++) {
                                    var currentChar = originalValue.charAt(i);
                                    if (currentChar == '[') {
                                        stackCtr++;
                                    } else if (currentChar == ']') {
                                        stackCtr--;
                                        if (stackCtr == 0) {
                                            if (i == originalValue.length -1) {
                                                top.logMessage("LPV20018S", fileName, value, key);
                                                validString = false;
                                            }
                                        }
                                    }
                                    if (validString) {
                                        value = originalValue;
                                    }
                                }
                            }
                        }
                        value = handleSpecialChars(fileName, value);
                        assignValue(fileName, propertiesArray, key, key, value, isFallBackLocale);
                    } else {
                        // Only occurs if last property in file has no value
                        top.logMessage("LPV20028F", curLine, fileName);          
                    }                    
                }
            } else {
                // No equal sign or colon found after property name
                top.logMessage("LPV20027F", curLine, fileName);          
            }
            index++;
        }
    } catch(e) {
        top.logException(e,arguments);
    }
}

// private helper function to remove blank lines
function removeBlankLines(arrayOfLines) {
    try {
        for (var index = arrayOfLines.length-1; index >= 0; index--) {
            if (arrayOfLines[index].length == 0)
                arrayOfLines.splice(index, 1);
        }
    } catch(e) {
        top.logException(e,arguments);
    }
}


// private helper function to handle special characters within Strings
function handleSpecialChars(fileName, propertyValue){

    var retVal = "";
    var state = 0;
    var START = 0;
    var PROCESSSLASH = 1;
    var UNICODE = 2;
    //Only processing strings since arrays are being handled by the eval statement in the getKeyValuePairs function
    if (typeof propertyValue != "string") {
        return propertyValue;
    } else {
        try {
            var i = 0;
            while (i < propertyValue.length) {
                var curChar = propertyValue.charAt(i);
                if (state == START) {
                    if (curChar != '\\') {
                        retVal = retVal + curChar;
                        i++;
                    } else {
                        state = PROCESSSLASH;
                    }       
                } else if (state == PROCESSSLASH) {
                    var nextPosition = i + 2;
                    var nextChar = propertyValue.substring(i+1, nextPosition);
                    if (nextChar == "u") {
                        i += 2;
                        state = UNICODE;
                    } else if (nextChar == ' ') {
                        retVal = retVal + String.fromCharCode(32);
                        i += 2;
                        state = START;
                    } else if (nextChar == "'") {
                        retVal = retVal + String.fromCharCode(39);
                        i += 2;
                        state = START;
                    } else if (nextChar == '"') {
                        retVal = retVal + String.fromCharCode(34);
                        i += 2;
                        state = START;
                    } else if (nextChar == '\\') {
                        retVal = retVal + String.fromCharCode(92);
                        i += 2;
                        state = START;
                    } else if (nextChar == 'r') {
                        retVal = retVal + String.fromCharCode(13);
                        i += 2;
                        state = START;
                    } else if (nextChar == "n") {
                        retVal = retVal + String.fromCharCode(10);
                        i += 2;
                        state = START;
                    } else if (nextChar == 't') {
                        retVal = retVal + String.fromCharCode(9);
                        i += 2;
                        state = START;
                    } else {
                        top.logMessage("LPV21035W", nextChar, fileName);
                        break;
                    }
                } else if (state == UNICODE) {
                    if ((i + 4) <= propertyValue.length) {
                        var uniString = propertyValue.substring(i, i+4);
                        if (validateUnicodeChar(uniString)) {
                            var letter = parseInt(uniString, 16);
                            retVal = retVal + String.fromCharCode(letter);
                            i += 4;
                        }
                        state = START;
                    }
                }
            }
        }        
        catch(e) {
            top.logException(e,arguments);
        }
    }
    return retVal;
}

// validates wether or not a character is a valid hexadecimal character
function validateUnicodeChar(unicodeString){
    var i;
    var valid = true;    
    try{
        for (i=0; i < unicodeString.length && valid; i++) {
            var uniChar = unicodeString.charCodeAt(i);
            valid = (uniChar >= 48 && uniChar <=57)||(uniChar >= 65 && uniChar <=70)||(uniChar >= 97 && uniChar <=102); 
        }    
    }catch(e) {
        top.logException(e,arguments);
        valid = false;
    }
    if (!valid) {
        top.logMessage("LPV21034W", unicodeString.charAt(i-1));
    }
    return valid;
}


// reads a single resource file
// securityFcn: function = new Function('return window')
// fileName: string - full qualified native file name
// properties: [] - array of key/value pairs
// isFallBackLocale: boolean
// returns void
function secureReadPropertyFile(securityFcn,fileName,properties,isFallBackLocale) {
    try {
        var lines = secureReadTextFile(securityFcn, fileName);
        combineContinuedLines(lines);
        getKeyValuePairs(fileName, lines, properties, isFallBackLocale);
    } catch(e) {
        top.logException(e,arguments);
    }
}

