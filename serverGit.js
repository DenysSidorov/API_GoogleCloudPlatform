const fs = require("fs");
const restify = require("restify");
const uuidv4 = require("uuid/v4");
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = 'js-shop-images';
const storage = Storage({
    keyFilename: './js-shop-ef1e8e8b68e7.json', // if  exists environment  use only Storage()
    projectId: projectId,
})
const bucket = storage.bucket(CLOUD_BUCKET);

const uploadUser = (req, res) => {
    const {file} = req.files;
    const gcsname = uuidv4() + file.name;
    const files = bucket.file(gcsname);

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

export default uploadUser;