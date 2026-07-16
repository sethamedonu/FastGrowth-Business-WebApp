const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl }     = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 }       = require('uuid');
const s3                   = require('../config/s3');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB   = 5;

async function presign(req, res, next) {
  try {
    const { filename, contentType } = req.body;

    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({ success: false, message: 'File type not allowed' });
    }

    const ext    = filename.split('.').pop();
    const key    = `uploads/${uuidv4()}.${ext}`;
    const bucket = process.env.S3_BUCKET_UPLOADS;

    const command = new PutObjectCommand({
      Bucket:      bucket,
      Key:         key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

    res.json({
      success: true,
      data: {
        uploadUrl: url,
        fileUrl:   `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { presign };
