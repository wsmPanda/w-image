var fs = require("fs");
var path = require("path");
var { exec } = require("child_process");
function walkFilesAsync(path, cb) {
  var pa = fs.readdirSync(path);
  pa.forEach(function(ele, index) {
    var info = fs.statSync(path + "/" + ele);
    if (info.isDirectory()) {
      walkFilesAsync(path + "/" + ele);
    } else {
      cb && cb(ele);
    }
  });
}

export { walkFilesAsync };
