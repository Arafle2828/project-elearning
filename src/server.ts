// inisialisasi
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');

const apiRoutes = require('./routes');

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

// middleware request body, jika diperlukan
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '../public')));

// Root endpoint - API status
app.get('/', (req: any, res: any) => {
  res.status(200).json({
    statusCode: 200,
    message: 'API E-Learning berhasil dinyalakan! 🚀',
    status: 'success',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      users: '/api/users'
    },
    documentation: 'Gunakan /api untuk mengakses endpoint API'
  });
});

// handle seluruh request /api/* ke route API
app.use('/api', apiRoutes);

// 404 handler untuk route yang tidak ditemukan
app.use('*', (req: any, res: any) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Endpoint tidak ditemukan! 🔍',
    status: 'error',
    timestamp: new Date().toISOString(),
    requestedPath: req.originalUrl,
    suggestion: 'Gunakan endpoint / atau /api untuk melihat daftar endpoint yang tersedia'
  });
});

// event loop
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;
