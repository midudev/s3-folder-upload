# s3 folder upload

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/s3-folder-upload.svg)](https://badge.fury.io/js/s3-folder-upload)
[![npm](https://img.shields.io/npm/dm/s3-folder-upload.svg?maxAge=2592000)]()

Little script to upload statics to a S3 bucket by using official Amazon SDK.

## AWS Credentials

In order to use this module, you'll need a file `aws-credentials.json` in the root of your project with the keys needed for upload files to the bucket.

## Install

```bash
npm install s3-folder-upload -S
```

In case you want to use the CLI, you can install it globally:

```bash
npm install -g s3-folder-upload
```

## Require
```javascript
const s3UploadFolder = require('s3-folder-upload')
// ES6: import s3UploadFolder from 's3-folder-upload'

const directoryName = 'statics'
s3FolderUpload(directoryName)
```

## CLI
```bash
s3-folder-upload <folder>

Example:
s3-folder-upload statics
```

## Wish list

- [x] Upload a entire folder to S3 instead file
- [x] Async upload of files to improve time
- [x] Detect automatically the content type of (limited support)
- [x] Return the list of files uploaded with the final URL
- [ ] Improve content type function in order to get more and better types of files
- [ ] Avoid to re-upload files if they didn't change
- [ ] Check if cache is blocking updates of statics on website.
