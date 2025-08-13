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
        search: 'GET /api/courses/search',
        categories: 'GET /api/courses/categories',
        getBySlug: 'GET /api/courses/:slug',
        create: 'POST /api/courses',
        update: 'PUT /api/courses/:slug',
        delete: 'DELETE /api/courses/:slug'
      },
      books: {
        getAll: 'GET /api/books',
        search: 'GET /api/books/search',
        categories: 'GET /api/books/categories',
        getBySlug: 'GET /api/books/:slug',
        create: 'POST /api/books',
        update: 'PUT /api/books/:slug',
        delete: 'DELETE /api/books/:slug'
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

// handle semua route /api/books ke router book
router.use('/books', require('./book-routes'));

module.exports = router;
