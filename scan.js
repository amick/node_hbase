// This section includes a fix from here:
// https://stackoverflow.com/questions/17415528/nodejs-hbase-thrift-weirdness/21141862#21141862
var thrift = require('thrift'),
  HBase = require('./gen-nodejs/HBase.js'),
  HBaseTypes = require('./gen-nodejs/HBase_types.js'),
  connection = thrift.createConnection('localhost', 9090, {
    transport: thrift.TBufferedTransport,
    protocol: thrift.TBinaryProtocol
  });
  
connection.on('connect', function() {
  var client = thrift.createClient(HBase,connection);
  
	// Get data based on a rowkey prefix using a scan.
  	// the andyamick table has rowkeys that are text, not bytes.  To use a table with bytes in the rowkey, would need to do an md5 hash first.
  	// See scanWithBytes.js code for an exmaple
	client.scannerOpenWithPrefix('andyamick', 'r1', ['d:c1'], null, function (err, scannerId) {
	console.log('***');
	console.log('***');
    if (err) {
      console.log(err);
      return;
    }
    console.log('scannerid : ' + scannerId);
    
	client.scannerGetList(scannerId, 10, function (serr, data) {
      if (serr) {
        console.log(serr);
        return;
      }
      console.log(data);
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