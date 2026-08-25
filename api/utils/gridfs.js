// utils/gridfs.js
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');

let client;
let bucket;

async function connect(uri) {
  if (client && client.topology && client.topology.isConnected()) return { client, bucket };
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(); // utilise la DB de la connection string
  bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  return { client, bucket };
}

async function uploadBuffer(buffer, filename, contentType) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { contentType });
    uploadStream.end(buffer);
    uploadStream.on('finish', file => resolve(file));
    uploadStream.on('error', err => reject(err));
  });
}

function downloadStreamById(id) {
  return bucket.openDownloadStream(ObjectId(id));
}

module.exports = { connect, uploadBuffer, downloadStreamById };
