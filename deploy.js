


var dist = require('distruct');
var AWS = require('aws-sdk');
var path = require("path");
var fs = require('fs');
var mime = require('mime-types');

var secret = require(__dirname + '/.secret.json');

dist.config('./config.json');

var uploadDir = function(s3Path, bucketName) {

    let s3 = new AWS.S3(secret.aws);

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function(filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length+1);
        console.log('mime:', mime.lookup(filePath));
        let params = {
            Bucket:         bucketName, 
            Key:            bucketPath, 
            Body:           fs.readFileSync(filePath),
            ContentType:    mime.lookup(filePath),
            ACL:            'public-read'
        };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
            }
        });

    });
};

uploadDir(__dirname + "/dist/web", "cdn.iohq.org/uix");
