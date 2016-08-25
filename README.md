# re-upload-statics

Little script to upload our statics to the S3 buckets. If you need to use a staitc on the fotocasa.es website you should use this module in order to mantain here all the statics. Also, in the statics folder you'll find all the statics.

## Rules when adding new statics
* Keep the basic naming convention `(page|component)_(use|description).(ext)` (take a look to the statics folder for examples)
* Try to be reasonable. If it's an icon, it might be good to use a SVG instead.
* Optimize assets before uploading them to the bucket.

## AWS Credentials

In order to use this module, you'll need a file `aws-credentials.json` in the root of your github repository with the keys needed for upload files to the bucket.

## Upload
```
npm run upload
```

## Wish list

- [x] Upload a entire folder to S3 instead file
- [x] Async upload of files to improve time
- [x] Detect automatically the content type of (limited support)
- [x] Return the list of files uploaded with the final URL
- [ ] Improve content type function in order to get more and better types of files
- [ ] Avoid to re-upload files if they didn't change
- [ ] Check if cache is blocking updates of statics on website.
