// https://cloud.google.com/storage/docs/reference/libraries?hl=ru#client-libraries-resources-nodejs
// https://cloud.google.com/nodejs/docs/reference/storage/1.3.x/?hl=ru
// https://cloud.google.com/nodejs/docs/reference/storage/1.3.x/File?hl=ru#get
// https://console.cloud.google.com/storage/browser/js-shop-images?project=js-shop  -   LIST OF FILES
// https://github.com/googleapis/nodejs-storage/blob/master/samples/files.js        -   NODE-JS
// https://cloud.google.com/storage/docs/json_api/v1/buckets/get                    -   COOL
const fs = require('fs');
const removeLeadingSlash = require('remove-leading-slash');
// Imports the Google Cloud client library.
const Storage = require('@google-cloud/storage');
// Your Google Cloud Platform project ID
const projectId = '461143987983';
// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
// mac/osX
// export GOOGLE_APPLICATION_CREDENTIALS=<path_to_service_account_file>
// windows
// set GOOGLE_APPLICATION_CREDENTIALS=<path_to_service_account_file>
const storage = Storage({
    keyFilename: './js-shop-ef1e8e8b68e7.json', // if  exists environment  use only Storage()
    projectId: projectId,
});
//
//
// // The name for the new bucket
// const bucketName = 'js-shop-images';
//
// var myBucket = storage.bucket(bucketName);
//
// function listFiles(bucketName) {
//     // [START storage_list_files]
//     // Imports the Google Cloud client library
//     // Lists files in the bucket
//     storage
//         .bucket(bucketName)
//         .getFiles()
//         .then(results => {
//             const files = results[0];
//
//             console.log('Files:');
//             files.forEach(file => {
//                 console.log(file.name);
//             });
//         })
//         .catch(err => {
//             console.error('ERROR:', err);
//         });
//     // [END storage_list_files]
// }
// listFiles(bucketName);


// // The name for the new bucket
const bucketName = 'js-shop-images';
var myBucket = storage.bucket(bucketName);





const existsFile = async(fileName, callback)=>{
    var file = myBucket.file(fileName);
    try{
        let result = await file.exists(callback);
        return result;
    } catch (er){
        console.log(er);
    }
}

// existsFile('1.png', function(err, exists) {
//     if (err) console.log(err);
//     console.log(exists);
// } );



function downloadFile(bucketName, srcFilename, destFilename) {
    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: destFilename,
    };

    // Downloads the file
    storage
        .bucket(bucketName)
        .file(srcFilename)
        .download(options)
        .then(() => {
            console.log(
                // `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
            );
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    // [END storage_download_file]
}
// downloadFile(bucketName, fileImg, '3333');


var fileImg = fs.readFileSync('./4.png');

function uploadFile(bucketName, filename) {

    // Uploads a local file to the bucket
    storage
        .bucket(bucketName)
        .upload(filename)
        .then(() => {
            console.log(`${filename} uploaded to ${bucketName}.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}
uploadFile(bucketName, fileImg.toString() );


// file.exists().then(function(data) {
//     var exists = data[0];
//         console.log(exists, 'r');
// }).catch(function (er) {
//     console.log(er, 'er');
// });










// /**
//  * Created by Denis on 15.09.2017.
//  */
// var jwt  = require('jsonwebtoken');
// var express =require( 'express');
//
//
// var app = express(); // Запуск приложения
//
// app.listen(3009, function(err){
//     if (err) throw err;
// console.log('Server listening on port ' + 3009 );
//
//
//     app.get('/', function(req, resp){
//         resp.json({h:5});
//     })
// });