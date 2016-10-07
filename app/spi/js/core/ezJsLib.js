var ezJsLib;

(function() {
    if (typeof ezJsLib != "undefined") {
        return;
    } else {
        //$ ****** init ******
        ezJsLib = {};

        // ****** package for Xml Dom ******
        ezJsLib.XmlDom = {
            parse: function(_xml) {
                if ($) {
                    return $.parseXML(_xml);
                } else if (DOMParser) {
                    // Mozilla, Firefox, and related browsers
                    return (new DOMParser()).parseFromString(_xml, "text/xml");
                }
            },
            getValueByTag: function(_tag, _dom) {
                var nodevalue = null;
                var root = _dom.documentElement;
                return this.getValueByTagFromNode(_tag, root);
            },
            getValueByTagFromNode: function(_tag, _node) {
                var nodevalue = null;
                var nodes = _node.getElementsByTagName(_tag);
                if (nodes[0]) {
                    if ($) {
                        return $(nodes[0]).text();
                    }

                    if (nodes[0].firstChild) {
                        nodevalue = nodes[0].firstChild.nodeValue;
                    }
                    return nodevalue;
                }
                return nodevalue;
            },
            getValueByTagAndIndex: function(_tag, _dom, _index) {
                var nodevalue = null;
                var root = _dom.documentElement;
                return this.getValueByTagAndIndexFromNode(_tag, root, _index);
            },
            getValueByTagAndIndexFromNode: function(_tag, _node, _index) {
                var nodevalue = null;
                var nodes = _node.getElementsByTagName(_tag);
                if (nodes[_index]) {
                    if ($) {
                        return $(nodes[_index]).text();
                    }

                    if (nodes[_index].firstChild) {
                        nodevalue = nodes[_index].firstChild.nodeValue;
                    }
                }
                return nodevalue;
            },
            getNodeByTagAndIndex: function(_tag, _dom, _index) {
                var node = null;
                var root = _dom.documentElement;
                var nodes = root.getElementsByTagName(_tag);
                if (nodes[_index]) {
                    node = nodes[_index];
                }
                return node;
            },
            getStatus: function(statusValue) {
                switch (statusValue) {
                    case "Ready":
                        statusValue = "Not Started";
                        break;
                    case "Start Package installation.":
                    case "Start to Unzip Payload File.":
                    case "Start Calling iFlash to Update Package.":
                        statusValue = "Running";
                        break;
                    case "Package installation successfully.":
                        statusValue = "Successfully Installed";
                        break;
                    case "Parse Firmware Package XML Failed.":
                    case "skip installation successfully.":
                        statusValue = "Not Applicable";
                        break;
                    case "Package installation Fail.":
                    case "Package installation Failed.":
                        statusValue = "Install did not succeed";
                        break;
                    default:
                        break;
                }
                return statusValue;
            }

        };
    }
})();