const fs = require("fs");
const restify = require("restify");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");

const fileUpload = require('express-fileupload');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const CLOUD_BUCKET = 'js-shop-images';
const projectId = '461143987983';
const storage = Storage({
    keyFilename: './js-shop-ef1e8e8b68e7.json', // if  exists environment  use only Storage()
    projectId: projectId,
})


const bucket = storage.bucket(CLOUD_BUCKET);

/**
 * Created by Denis on 15.09.2017.
 */
var jwt  = require('jsonwebtoken');
var express =require( 'express');


var app = express(); // Запуск приложения
// default options
app.use(fileUpload());
app.listen(3030, function(err){
    if (err) throw err;
console.log('Server listening on port ' + 3030 );


    app.get('/', function(req, resp){
        resp.json({h:5});
    })

    app.post('/user/upload', uploadUser )
});



const uploadUser = (req, res) => {
    const file = req.files.file;
    console.log(file);
    const gcsname = uuidv4() + file.name;
    const files = bucket.file(gcsname);
console.log(file.path, 'file.path');
    fs.createReadStream(file.path)
        .pipe(files.createWriteStream({
            metadata: {
                contentType: file.type
            }
        }))
        .on("error", (err) => {
            restify.InternalServerError(err);
        })
        .on('finish', () => {
            res.json({
                success: true,
                fileUrl: `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`
            })
        });
};
