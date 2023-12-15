var fs = require('fs');
var version = '';

if(process.argv.length != 3){
  process.exit(1);
} else {
  version = process.argv[2];
}

if(version !== ''){
  var d = new Date();
  var timestamp = d.toLocalDateString() + " " + d.toLocalTimeString();
  var build = fs.readFileSync('server/config/monitoring.yaml', 'UTF-8');
  build = build.replace('###BUILD_DATE###', timestamp);
  build = build.replace('###BUILD_VERSION###', version);
  fs.writeFileSync('server/config/monitoring.yaml', build);
}
