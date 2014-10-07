// This section includes a fix from here:
// https://stackoverflow.com/questions/17415528/nodejs-hbase-thrift-weirdness/21141862#21141862
var crypto = require('crypto');
var thrift = require('thrift'),
HBase = require('./gen-nodejs/HBase.js'),
HBaseTypes = require('./gen-nodejs/HBase_types.js'),
connection = thrift.createConnection('localhost', 9090, {
	transport: thrift.TBufferedTransport,
	protocol: thrift.TBinaryProtocol
});
  
connection.on('connect', function() {
	var client = thrift.createClient(HBase,connection);
	
	var prefix = "NP_MF_ECOMP1";
	var hash = crypto.createHash('md5');
	var prefixHashed = hash.update(prefix).digest("utf-16");
	console.log('prefix hashed = ' + prefixHashed);
	
	client.scannerOpenWithPrefix('test2', prefixHashed, ['D:SITE','D:FACILITY','D:POINT_TIME','D:FWGGAS_VALUE','D:PCASE_VALUE'], null, function (err, scannerId) {
		console.log('***');
		console.log('***');
    	if (err) {
      	  	console.log(err);
      		return;
    	}
    	//console.log('scannerid : ' + scannerId);
    
		client.scannerGetList(scannerId, 10, function (serr, data) {
      		if (serr) {
        		console.log(serr);
        		return;
      	  	}
	  	  	//console.log('--- full data object --');
      	  	//console.log(data);
	  	  	//console.log('-- data[0]');
	  	  	//console.log(data[0]);
	  	  	//console.log('-- data[0].columns');
	  	  	//console.log(data[0].columns);
	  	  	//console.log('-- column value for D:FACILITY column');
	  	  	//console.log(data[0].columns['D:FACILITY'].value);
	  	  	//console.log('-- column value for D:POINT_TIME column');
	  	  	//console.log(data[0].columns['D:POINT_TIME'].value);
	  
	  	  	console.log('---');
	  	  	console.log('---');
	  	  	for (var i=0;i<data.length;i++) {
				console.log('*** row ' + i);
				console.log('     facility = ' + data[i].columns['D:FACILITY'].value);
				console.log('     point time= ' + data[i].columns['D:POINT_TIME'].value);
				console.log('     FWGGAS = ' + data[i].columns['D:FWGGAS_VALUE'].value);
			}
		});
	
		client.scannerClose(scannerId, function (err) {
			if (err) {
				console.log(err);
			}
		});
		connection.end();
	});
});

connection.on('error', function(err){
  console.log('on error:', err);
});