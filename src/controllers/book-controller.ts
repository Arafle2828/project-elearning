import { Request, Response } from 'express';

const bookService = require('../services/book-service');

// mendapatkan list buku
exports.index = async (req: Request, res: Response) => {
  try {
    const books = await bookService.getAllBooks();

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil mendapatkan data buku!',
      data: books,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
}

// search & filter buku
exports.search = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      category, 
      author, 
      language,
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      search: search as string,
      category: category as string,
      author: author as string,
      language: language as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await bookService.searchBooks(filters);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil mendapatkan data buku!',
      data: result.books,
      pagination: {
        currentPage: filters.page,
        totalPages: Math.ceil(result.total / filters.limit),
        totalItems: result.total,
        itemsPerPage: filters.limit
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
}

// mendapatkan buku berdasarkan slug
exports.show = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const book = await bookService.getBookBySlug(slug);

    if (!book) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Buku tidak ditemukan',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil mendapatkan data buku!',
      data: book,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
}

// menambahkan buku baru
exports.create = async (req: Request, res: Response) => {
  const data = req.body;
  const files: any = req.files;
  data.files = files;

  try {
    const newBook = await bookService.addBook(data);

    return res.status(201).json({
      statusCode: 201,
      message: 'Berhasil menambahkan buku baru!',
      data: newBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};

// mengubah buku
exports.update = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = req.body;
  const files: any = req.files;
  data.files = files;
  
  try {
    const existingBook = await bookService.getBookBySlug(slug);
    if (!existingBook) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Buku tidak ditemukan',
      });
    }

    const updatedBook = await bookService.updateBook(existingBook, data);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil mengubah data buku!',
      data: updatedBook,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};

// menghapus buku
exports.destroy = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const existingBook = await bookService.getBookBySlug(slug);
    if (!existingBook) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Buku tidak ditemukan',
      });
    }

    await bookService.deleteBook(existingBook);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil menghapus buku!',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
};

// mendapatkan categories buku
exports.getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await bookService.getCategories();

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil mendapatkan kategori buku!',
      data: categories,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Error internal server!',
    });
  }
}
