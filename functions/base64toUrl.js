const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto')
const fs = require('fs');

const storage = new Storage({
    keyFilename: 'e-com-template.json',
    projectId: 'e-com-template-395710',
});

const bucketName = 'viral-photos'


async function saveImageToGCP(base64Image){
  // Extract image format and data from base64 string
  const matches = base64Image.match(/^data:image\/([a-z]+);base64,(.+)$/);
  if (!matches) {
  throw new Error('Invalid base64 image format');
  }

  const imageFormat = matches[1]; // Extracted image format (e.g., png, jpeg)
  const imageData = matches[2]; // Extracted image data (binary)

  // Decode base64 image data into binary
  const decodedImage = Buffer.from(imageData, 'base64');

  // Generate a unique filename or specify your own
  const filename = `${Date.now()}${crypto.randomBytes(16).toString("hex")}.${imageFormat}`;


  // Write the image data to a file
  fs.writeFile(filename, decodedImage, 'binary', async (err) => {
    if (err) {
      throw err;
    }

    // Upload the file to Google Cloud Storage
    try {
      const bucket = storage.bucket(bucketName);
      await bucket.upload(filename);

      // Delete the local file after uploading (optional)
      fs.unlinkSync(filename);

    } catch (err) {
      console.log(err)
    }
  })

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
  return publicUrl
}

module.exports = saveImageToGCP