const router = require('express').Router();

const bookController = require('../controllers/book-controller');

// GET /api/books - get all books
router.get('/', bookController.index);

// GET /api/books/search - search & filter books
router.get('/search', bookController.search);

// GET /api/books/categories - get book categories
router.get('/categories', bookController.getCategories);

// GET /api/books/:slug - get book by slug
router.get('/:slug', bookController.show);

// POST /api/books - create new book
router.post('/', bookController.create);

// PUT /api/books/:slug - update book
router.put('/:slug', bookController.update);

// DELETE /api/books/:slug - delete book
router.delete('/:slug', bookController.destroy);

module.exports = router;
