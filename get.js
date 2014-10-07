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
  
  // get a row based on the full rowkey.  
  client.get('andyamick', 'r1', 'd:c1', null, function(err, data) {
	  console.log('-----');
	  console.log('-----');
    if (err) {
      console.log('andyamick error: ', err);
    } else {
      console.log('andyamick table data: ', data);
	  //console.log("got it");
    }
    connection.end();
  });
});

connection.on('error', function(err){
  console.log('on error:', err);
});