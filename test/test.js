var proxyChecker = require('proxy-checker');
 
proxyChecker.checkProxiesFromFile(
	// The path to the file containing proxies 
	'D:/work/nwizard/test/proxy.txt',
	{
		// the complete URL to check the proxy 
		url: 'http://www.baidu.com',
		// an optional regex to check for the presence of some text on the page 
		regex: /Test/
	},
	// Callback function to be called after the check 
	function(host, port, ok, statusCode, err) {
		console.log(host + ':' + port + ' => '
			+ ok + ' (status: ' + statusCode + ', err: ' + err + ')');
	}
);