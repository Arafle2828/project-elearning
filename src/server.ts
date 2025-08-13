// inisialisasi
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');

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

// Import routes dengan error handling
try {
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
  app.use('/api', (req: any, res: any) => {
    res.status(500).json({
      statusCode: 500,
      message: 'Server configuration error',
      error: 'Routes loading failed'
    });
  });
}

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

// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
    status: 'error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { 
      error: error.message,
      stack: error.stack 
    })
  });
});

// event loop
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel serverless function
module.exports = app;
export default app;
