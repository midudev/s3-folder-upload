# s3 upload folder

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/s3-folder-upload.svg)](https://badge.fury.io/js/s3-folder-upload)

Little script to upload statics to a S3 bucket.

## AWS Credentials

In order to use this module, you'll need a file `aws-credentials.json` in the root of your github repository with the keys needed for upload files to the bucket.

## Require
```
const s3UploadFolder = require('s3-upload-folder')
// ES6: import s3UploadFolder from 's3-upload-folder'

const directoryName = 'statics'
s3UploadFolder(directoryName)
```

## CLI
```
s3-upload-folder <folder>

Example:
s3-upload-folder statics
```

## Wish list

- [x] Upload a entire folder to S3 instead file
- [x] Async upload of files to improve time
- [x] Detect automatically the content type of (limited support)
- [x] Return the list of files uploaded with the final URL
- [ ] Improve content type function in order to get more and better types of files
- [ ] Avoid to re-upload files if they didn't change
- [ ] Check if cache is blocking updates of statics on website.
