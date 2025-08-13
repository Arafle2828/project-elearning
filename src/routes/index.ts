const router = require('express').Router();

// Root API endpoint
router.get('/', (req: any, res: any) => {
  res.status(200).json({
    statusCode: 200,
    message: 'Welcome to E-Learning API! 📚',
    status: 'success',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout'
      },
      courses: {
        getAll: 'GET /api/courses',
        getBySlug: 'GET /api/courses/:slug',
        create: 'POST /api/courses',
        update: 'PUT /api/courses/:slug',
        delete: 'DELETE /api/courses/:slug'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      }
    }
  });
});

// handle semua route /api/auth ke router otentikasi
router.use('/auth', require('./auth-routes'));

// handle semua route /api/users ke router user
// router.use('/users', require('./user-routes'));

router.use('/courses', require('./course-routes'));

module.exports = router;
