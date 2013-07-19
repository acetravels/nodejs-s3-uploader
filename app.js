var express = require("express");
var app = express();
var gm = require("gm");
var fs = require("fs");
var AWS = require('aws-sdk');
var formidable = require('formidable');
var util = require("util");

var s3 = new AWS.S3();
var appconfig = require('./appconfig.json');
AWS.config.loadFromPath('./awsconfig.json');

var UPLOAD_FOLDER = appconfig.upload_folder;
var UPLOAD_FILE_EXTENSION = appconfig.upload_file_extension;
var MAX_FORM_FIELD_SIZE_IN_MB = appconfig.max_form_field_size_in_mb;
var S3_URL = appconfig.s3_url;
var BUCKET_NAME = appconfig.bucket_name;
var S3_FILE_ACL = appconfig.s3_file_acl;
var S3_FILE_CONTENT_TYPE = appconfig.s3_file_content_type;
var SIZES = appconfig.sizes;

app.post("/upload", function (req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname + "/" + UPLOAD_FOLDER;
	form.keepExtensions = true;
	form.encoding = 'utf-8';
	form.type = true;
	form.maxFieldsSize = MAX_FORM_FIELD_SIZE_IN_MB * 1024 * 1024;

    var files = [];
    form.on('file', function(field, file) {
        files.push(file.name);
    })

    form.on('end', function() {
    });

	form.parse(req, function(err, fields, files) {
    	var path = files.media.path;

    	getFileID(path, function (id){
    		saveImage(res, id, SIZES, 0);
    	})
	});
});

app.get("/", function(req, res){
	fs.readFile('index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
})

function getFileID(path, cb) {
	cb(path.replace(/^.*[\\\/]/, '').split('.')[0]);
}

function saveImage(res, id, sizes, index) {
	var w = sizes[index].w;
	var h = sizes[index].h;

	var SIZE_METADATA = "_" + w + "x" + h;
	var name_with_extn_original = id + UPLOAD_FILE_EXTENSION;
	var name_with_extn_resized = id + SIZE_METADATA + UPLOAD_FILE_EXTENSION;
	var local_file_original = UPLOAD_FOLDER + "/" + name_with_extn_original;
	var local_file_resized = UPLOAD_FOLDER + "/" + name_with_extn_resized;
	
	fs.readFile(local_file_original, function(err, data){
		gm(data).size(function(err, size){
			var ow = size.width;
			var oh = size.height;

			var s3bucket = new AWS.S3({params: {Bucket: BUCKET_NAME}});
			s3bucket.createBucket(function() {
				var x = (w*oh)/(h*ow);
				var iw = 0, ih = 0;
				var xc = 0, yc = 0;
				
				if(x>=1){
					ih = (oh*w)/ow;
					yc = Math.floor(Math.abs((ih-h)*0.5));
					gm(data).resize(w, ih).crop(w, h, 0, yc).write(local_file_resized, function(err){
						uploadToS3(local_file_resized, name_with_extn_resized, s3bucket, function(err){
							sizes[index].url = S3_URL + BUCKET_NAME+"/"+name_with_extn_resized;
							if(index<sizes.length-1){
								saveImage(res, id, sizes, index+1);
							}else{
								getOutputContent(id, sizes, function(output){
									res.write(JSON.stringify(output));
									res.end();
								})
							}
						});
					});
				}else{
					iw = (ow*h)/oh;
					xc = Math.floor(Math.abs((iw-w)*0.5));
					gm(data).resize(iw, h).crop(w, h, xc, 0).write(local_file_resized, function(err){
						uploadToS3(local_file_resized, name_with_extn_resized, s3bucket, function(err){
							sizes[index].url = S3_URL + BUCKET_NAME+"/"+name_with_extn_resized;
							if(index<sizes.length-1) {
								saveImage(res, id, sizes, index+1);
							}else{
								getOutputContent(id, sizes, function(output){
									res.write(JSON.stringify(output));
									res.end();
								})
							}
						});
					});
				}
			});
		});
	});
}

function uploadToS3(local_file_resized, name_with_extn_resized, s3bucket, cb) {
	fs.readFile(local_file_resized, function(err, data){
		var img = {Key: name_with_extn_resized, Body: new Buffer(data, 'binary'), ACL: S3_FILE_ACL, ContentType: S3_FILE_CONTENT_TYPE};
		s3bucket.putObject(img, function(err) {
			cb(err);
		});
	});
}

function getOutputContent(id, sizes, cb){
	var output = {};
	output["id"] = id;
	var i = 0;
	
	while(true){
		if(i<sizes.length){
			var size = sizes[i];
			var w = size.w;
			var h = size.h;
			var key = w+"x"+h;
			output[key] = size;
			i++;
		}else{
			cb(output);
		}
	}
}

var port = 8000;
app.listen(port);
console.log("Server listening at port: "+port);
