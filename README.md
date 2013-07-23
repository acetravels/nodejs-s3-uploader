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
* On the command prompt/shell, run: `node server.js` at the project directory path.
* UI to load the file: `http://localhost:3000`
* In the ui, browse for the file to upload, and provide name and description details

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
    "image_id": "31432de7b0765ff677d9c3a9c622b606",
    "title": "Travel places",
    "description": "The world is a book and those who do not travel read only a page\r\n-Quote by anonymouse",
    "sizes": [
      {
        "w": 640,
        "h": 360
      },
      {
        "w": 360,
        "h": 640
      },
      {
        "w": 80,
        "h": 80
      }
    ]
  }

  To get the details of the uploaded image later, hit the url in the below manner:
  
  http://localhost:3000/detail/31432de7b0765ff677d9c3a9c622b606

  where 31432de7b0765ff677d9c3a9c622b606 is the image id. The response to this is as follows:

  {
    "image_id": "31432de7b0765ff677d9c3a9c622b606",
    "title": "Travel places",
    "description": "The world is a book and those who do not travel read only a page\r\n-Quote by anonymouse",
    "_id": "51ee336cc6a2488026000002",
    "__v": 0,
    "sizes": [
      {
        "w": "640",
        "h": "360",
        "_id": "51ee336cc6a2488026000005"
      },
      {
        "w": "360",
        "h": "640",
        "_id": "51ee336cc6a2488026000004"
      },
      {
        "w": "80",
        "h": "80",
        "_id": "51ee336cc6a2488026000003"
      }
    ]
  }

LICENSE
-------
GPL. This application is not free of bugs, and it comes with no warranties of any sort.
Please feel free to make changes to the project and request for pull request.


