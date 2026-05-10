const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  // Добавляем принудительное использование path-style ссылок
  forcePathStyle: true, 
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    // Убираем acl, если сервер выдает 500. 
    // Публичность лучше настроить один раз в панели Timeweb для всего бакета.
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    key: function (req, file, cb) {
      const fileName = `avatars/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

module.exports = { upload };