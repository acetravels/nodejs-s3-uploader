NODEJS S3 UPLOADER
==================

This nodejs application can be used to resize and upload file(s) of multiple dimensions to Amazon S3. If the provided dimensions do not have the same aspect ratio as the original one, the resized images will be cropped horizontally or vertically. 

PREREQUISITE
------------
* node.js
* npm

HOW TO SETUP
------------
* git clone https://github.com/acetravels/nodejs-s3-uploader.git
* npm install


HOW TO RUN
----------
UI to load the file:
http://localhost:8000

CONFIGURATION
-------------
* Rename awsconfig.example.json to awsconfig.json
* Provide `accessKeyId`, `secretAccessKey` and change `region` if it's not in us-east-1.
* appconfig.json contains several configuration parameters. Update as required.
	{
		"upload_folder":"uploads",
		"upload_file_extension":".jpg",
		"max_form_field_size_in_mb": 10,
		"s3_url": "https://s3.amazonaws.com/",
		"bucket_name": "holiday-dev",
		"s3_file_acl": "public-read",
		"s3_file_content_type": "image/jpeg",
		"sizes": [{"w":640,"h":360,"url":null}, {"w":360,"h":640,"url":null}, {"w":80,"h":80,"url":null}]
	}

	upload_folder: This is where the images (original and resized) will be uploaded locally (in addition to s3)
	upload_file_extension: Default file extension is set to .jpg and can be changed.
	max_form_field_size_in_mb: This is the maximum image (actually form payload) size allowed.
	s3_url: Contains default s3 URI
	bucket_name: Name of the bucket to upload the images to.
	s3_file_acl: If this is not provided, the images will not be publicly available.
	s3_file_content_type: This is set to image/jpg so that it is returned as an image when requested with URI and not downloaded as a file.
	sizes: You can provide all desired sizes that you want to resize the image too. It can be provided in any number. Here w defines width and h defines height. Keep `url` null by default.

	

	The images will be uploaded in a sequential fashion, and once complete, it will return a json in the browser. It looks like below:

	{
		"id": "fd0974c336236f69db26474146903440",
		"640x360": {
			"w": 640,
			"h": 360,
			"url": "https://s3.amazonaws.com/holiday-dev/fd0974c336236f69db26474146903440_640x360.jpg"
		},
		"360x640": {
			"w": 360,
			"h": 640,
			"url": "https://s3.amazonaws.com/holiday-dev/fd0974c336236f69db26474146903440_360x640.jpg"
		},
		"80x80": {
			"w": 80,
			"h": 80,
			"url": "https://s3.amazonaws.com/holiday-dev/fd0974c336236f69db26474146903440_80x80.jpg"
		}
	}

LICENSE
-------
GPL licensed. Please feel free to make changes to the project and request for pull request.


