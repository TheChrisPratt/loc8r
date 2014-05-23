var mongoose = require('mongoose');
var readline = require('readline');

//var dbURI = 'mongodb://localhost/Loc8r';
var dbURI = 'mongodb://Anodyzed:4n0dyz3d@ds045089.mongolab.com:45089/loc8r';

mongoose.connect(dbURI);

mongoose.connection.on('connected',function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function() {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected',function() {
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg,callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + mst);
    callback();
  });
};

process.once('SIGUSR2',function() {
  gracefulShutdown('modemon restart',function() {
    process.kill(process.pid,'SIGUSR2');
  });
});
process.on('SIGINT',function() {
  gracefulShutdown('app termination',function() {
    process.exit(0);
  });
});
process.on('SIGINT',function() {
  gracefulShutdown('Heroku app shutdown',function() {
    process.exit(0);
  });
});

  // Windows SIGINT support
if(process.platform === 'win32') {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT',function() {
    process.emit('SIGINT');
  });
}

require('./locations');
