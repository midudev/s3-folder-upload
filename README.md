# s3 folder upload

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/s3-folder-upload.svg)](https://badge.fury.io/js/s3-folder-upload)
[![npm](https://img.shields.io/npm/dm/s3-folder-upload.svg?maxAge=10000)]()

Little script to upload statics to a S3 bucket by using official Amazon SDK.

## AWS Credentials

In order to use this module, you'll need to have **AWS Credentials**. You can load them using one of these two ways:

* By passing directly to the method as second parameter.
* By having a ENV variable with the path to a file with the credentials.
  The ENV variable is `AWS_CREDENTIALS_PATH` and it should have `accessKeyId`, `secretAccessKey`, `region` and `bucket`.

## Install

You can install as the package to be used in your project.

```bash
npm install s3-folder-upload
```

If you only wanto to use it as `devDependency` remember to use `-D` flag in order to put the dependency in the right place.

In case you want to use it only the CLI, you can could use it directly using `npx`:

```bash
npx s3-folder-upload
```

## Use as a package

```javascript
const s3FolderUpload = require('s3-folder-upload')
// ES6: import s3FolderUpload from 's3-folder-upload'

const directoryName = 'statics'
// I strongly recommend to save your credentials on a JSON or ENV variables, or command line args
const credentials = {
  "accessKeyId": "<Your Access Key Id>",
  "secretAccessKey": "<Your Secret Access Key>",
  "region": "<Your Aimed Region>",
  "bucket": "<Your Bucket Name>"
}

// optional options to be passed as parameter to the method
const options = {
  useFoldersForFileTypes: false,
  useIAMRoleCredentials: false
}

// optional options by file
const filesOptions: {
  'index.html': {
    'Cache-Control': 'public, max-age=300'
  }
}

s3FolderUpload(directoryName, credentials, options, filesOptions)
```

## Options
`useFoldersForFileTypes` (default: `true`) - Upload files to a specific subdirectory according to its file type.

`useIAMRoleCredentials` (default: `false`) - It will ignore all the credentials passed via parameters or environment variables in order to use the instance IAM credentials profile.

`uploadFolder` (default: `undefined`) - If it's specified, the statics will be uploaded to the folder, so if you upload `static.js` to `https://statics.s3.eu-west-1.amazonaws.com` with a `uploadFolder` with value `my-statics` the file will be uploaded to: `https://statics.s3.eu-west-1.amazonaws.com/my-statics/static.js`.

`ACL` (default: `public-read`) - It defines which AWS accounts or groups are granted access and the type of access.

`Cache-Control` (default: `public, max-age=31536000`) - HTTP header holds directives (instructions) for caching in both requests and responses.

`Expires` (default: `31536000`) - Header contains the date/time after which the response is considered stale. If there is a Cache-Control header with the max-age or s-maxage directive in the response, the Expires header is ignored.

If you use programatically the library, you could overwrite the `ACL`, `Cache-Control` and `Expires` values to file level.

```javascript
const options = {
  useFoldersForFileTypes: false,
  useIAMRoleCredentials: false,
  filesOptions: {
    'index.html': {
      'Cache-Control': 'public, max-age=300'
    }
  }
}

s3FolderUpload(directoryName, credentials, options)
```

## Use as CLI

```bash
s3-folder-upload <folder>

Example:
s3-folder-upload statics
```

**For the AWS Credentials**

* you can define a ENV variable called `AWS_CREDENTIALS_PATH` with the path of the file with the needed info.
* you can pass the needed info via command line parameters:
    ```bash
    s3-folder-upload <folder> --accessKeyId=<your access key id> --bucket=<destination bucket> --region=<region> --secretAccessKey=<your secret access key>
    ```
* you can use `useIAMRoleCredentials` option in order to rely on IAM Profile instance instead any passed by variables and environment

**For Options**

* you can pass the needed info via command line parameters:
    ```bash
    s3-folder-upload <folder> <credentials parameters> --useFoldersForFileTypes=false
    ```

### Environment Variables
`S3_FOLDER_UPLOAD_LOG`: You could specify the level of logging for the library.
* `none`: No logging output
* `only_errors`: Only errors are logged
* `all` (default): Errors, progress and useful messages are logged.

Example of use:
```
S3_FOLDER_UPLOAD_LOG=only_errors s3-folder-upload <folder>
```

If you use the library programatically, this ENVIRONEMNT_VARIABLE will be read as well. For example:

```
S3_FOLDER_UPLOAD_LOG=only_errors node upload-script.js
```
