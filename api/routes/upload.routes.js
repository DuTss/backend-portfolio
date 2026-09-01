// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMemory');
const { connect, uploadBuffer, downloadStreamById } = require('../utils/gridfs');

const MONGODB_URI = process.env.MONGODB_URI;
let connected = false;

async function ensureConnected() {
  if (!connected) {
    await connect(MONGODB_URI);
    connected = true;
  }
}

// Upload endpoint
router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    await ensureConnected();
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const file = await uploadBuffer(req.file.buffer, Date.now() + '-' + req.file.originalname, req.file.mimetype);
    res.json({ ok: true, id: file._id.toString(), filename: file.filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Download endpoint
router.get('/api/files/:id', async (req, res) => {
  try {
    await ensureConnected();
    const id = req.params.id;

    // 1. En-têtes pour autoriser le Cross-Origin (Déblocage CORB)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    const mimeType = mime.lookup(filePath);
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    
    const stream = downloadStreamById(id);
    stream.on('error', () => res.status(404).json({ error: 'Not found' }));
    stream.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
