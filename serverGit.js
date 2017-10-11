// dependencies
const fs = require("fs");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");

// set tools for multipart/form-data
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// settings for Google Cloud Platform (Storage)
const CLOUD_BUCKET = 'js-shop-images';
const projectId = '461143987983';
const storage = Storage({
    keyFilename: './js-shop-ef1e8e8b68e7.json', // if  exists environment  use only Storage()
    projectId: projectId,
})
const bucket = storage.bucket(CLOUD_BUCKET);

//settings for app
var express = require('express');
var app = express();
app.listen(3030, function (err) {
    if (err) throw err;
    console.log('Server listening on port ' + 3030);
})

// routes
app.get('/', function (req, resp) {
    resp.json({h: 5});
})

// help route for upload file
const uploadFile = (req, res) => {
    console.log(req.files, 'files');
    const file = req.files.fileName;
    console.log(file);
    if (file.fieldName && file.size > 0) {
        if (file.type != 'image/jpg'
            && file.type != 'image/gif'
            && file.type != 'image/jpeg'
            && file.type != 'image/png'
            && file.type != 'image/svg'
        ) {
            return res.json({
                success: false,
                message: `Format of file isn't of image. Or bad format of image, use only .jpg, .gif, .png, .jpeg .svg `
            })
        } else {
            const gcsname = uuidv4() + file.name;
            const storage = bucket.file(gcsname);

            console.log(file.path, 'file.path');
            fs.createReadStream(file.path)
                .pipe(storage.createWriteStream({
                    metadata: {
                        contentType: file.type
                    }
                }))
                .on("error", (err) => {
                    console.log(err);
                    res.json({
                        success: false,
                        message: `Can't create file, try again or later`,
                        fileUrl: `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`
                    })
                })
                .on('finish', () => {

                    storage.makePublic().then(function (data) {
                        var apiResponse = data[0];
                        console.log(apiResponse, 'apiResponse');
                        res.json({
                            success: true,
                            message: 'File was created',
                            fileUrl: `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`
                        })
                    }).catch(err => {
                        res.json({
                            success: false,
                            message: `Can't set public-file`
                        })
                    });
                });
        }
    } else {
        res.json({
            success: false,
            message: `File not found`
        })
    }
};

app.post('/user/upload', multipartMiddleware, uploadFile)
app.get('/user/upload', (req, resp)=>{
    const storage = bucket.file('1.png');
    storage.delete().then(function(data) {
        var apiResponse = data[0];
        console.log(apiResponse, 'apiResponse');
        resp.json({
            success: true,
            message: `File was deleted`
        })
    }).catch((er)=>{
        console.log(er, 'er');
        resp.json({
            success: false,
            message: `File not found`
        })
    });
    // console.log(req.body, 'body');
})
