import { Book } from '../models/book-model';
import { generateSlug, generateUniqueSlug } from '../utilities/slug';

const bookRepository = require('../repositories/book-repository');
const filesystem = require('../utilities/filesystem');

// dapatkan semua buku
exports.getAllBooks = async (): Promise<Book[]> => {
  return await bookRepository.getAllBooks();
};

// dapatkan buku dari slug
exports.getBookBySlug = async (slug: string) => {
  const book = await bookRepository.getBookBySlug(slug);

  if (!book) {
    return null;
  }

  return book;
};

// search & filter buku
exports.searchBooks = async (filters: any) => {
  return await bookRepository.searchBooks(filters);
};

// menambahkan buku baru
exports.addBook = async (data: Partial<Book>) => {
  // Handle file uploads
  if (data.files && data.files.length > 0) {
    const coverImage = data.files.filter((file: any) => file.fieldname === 'cover_image');
    const bookFile = data.files.filter((file: any) => file.fieldname === 'book_file');

    if (coverImage.length > 0) {
      const coverImagePath = await filesystem.upload(coverImage[0], 'books/covers');
      data.cover_image = coverImagePath;
    }

    if (bookFile.length > 0) {
      const bookFilePath = await filesystem.upload(bookFile[0], 'books/files');
      data.file_path = bookFilePath;
    }
  }

  // Generate slug dari title
  if (data.title) {
    let slug = generateSlug(data.title);
    const existingBook = await bookRepository.getBookBySlug(slug);
    
    if (existingBook) {
      slug = generateUniqueSlug(data.title);
    }
    
    data.slug = slug;
  }

  // Set default values
  data.is_active = data.is_active !== undefined ? data.is_active : true;
  data.language = data.language || 'id';
  
  delete data.files;

  return await bookRepository.addBook(data);
};

// mengubah buku
exports.updateBook = async (existingBook: Book, data: Partial<Book>) => {
  // Handle file uploads
  if (data.files && data.files.length > 0) {
    const coverImage = data.files.filter((file: any) => file.fieldname === 'cover_image');
    const bookFile = data.files.filter((file: any) => file.fieldname === 'book_file');

    if (coverImage.length > 0) {
      const coverImagePath = await filesystem.update(existingBook.cover_image, coverImage[0], 'books/covers');
      data.cover_image = coverImagePath;
    }

    if (bookFile.length > 0) {
      const bookFilePath = await filesystem.update(existingBook.file_path, bookFile[0], 'books/files');
      data.file_path = bookFilePath;
    }
  }

  // Update slug jika title berubah
  if (data.title && data.title !== existingBook.title) {
    let slug = generateSlug(data.title);
    const existingSlugBook = await bookRepository.getBookBySlug(slug);
    
    // Jika slug sudah ada dan bukan milik book yang sedang diupdate
    if (existingSlugBook && existingSlugBook.id !== existingBook.id) {
      slug = generateUniqueSlug(data.title);
    }
    
    data.slug = slug;
  }
  
  delete data.files;

  return await bookRepository.updateBook(existingBook.slug, data);
};

// menghapus buku (soft delete)
exports.deleteBook = async (existingBook: Book) => {
  return await bookRepository.deleteBook(existingBook.slug);
};

// mendapatkan categories
exports.getCategories = async () => {
  return await bookRepository.getCategories();
};
