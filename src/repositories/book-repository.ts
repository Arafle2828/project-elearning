import { Book } from '../models/book-model';

exports.getAllBooks = async (): Promise<Book[]> => {
  return await Book.query().where('is_active', true);
};

exports.getBookBySlug = async (slug: string): Promise<Book> => {
  return await Book.query().findOne({ slug, is_active: true });
};

exports.addBook = async (data: Partial<Book>): Promise<Book> => {
  return await Book.query().insert(data);
};

exports.updateBook = async (slug: string, data: Partial<Book>): Promise<Book | undefined> => {
  return await Book.query().patch(data).where('slug', slug).returning('*').first();
};

exports.deleteBook = async (slug: string): Promise<number> => {
  return await Book.query().patch({ is_active: false }).where('slug', slug);
};

exports.searchBooks = async (filters: any): Promise<{ books: Book[], total: number }> => {
  let query = Book.query().where('is_active', true);

  // Search in title, author, and description
  if (filters.search) {
    query = query.where((builder: any) => {
      builder
        .where('title', 'ILIKE', `%${filters.search}%`)
        .orWhere('author', 'ILIKE', `%${filters.search}%`)
        .orWhere('description', 'ILIKE', `%${filters.search}%`);
    });
  }

  // Filter by category
  if (filters.category) {
    query = query.where('category', '=', filters.category);
  }

  // Filter by author
  if (filters.author) {
    query = query.where('author', 'ILIKE', `%${filters.author}%`);
  }

  // Filter by language
  if (filters.language) {
    query = query.where('language', '=', filters.language);
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    query = query.where('price', '>=', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.where('price', '<=', filters.maxPrice);
  }

  // Count total
  const totalQuery = query.clone();
  const total = await totalQuery.resultSize();

  // Apply sorting
  query = query.orderBy(filters.sortBy, filters.sortOrder);

  // Apply pagination
  const offset = (filters.page - 1) * filters.limit;
  query = query.limit(filters.limit).offset(offset);

  const books = await query;

  return { books, total };
};

exports.getCategories = async (): Promise<string[]> => {
  const categories = await Book.query()
    .select('category')
    .distinct()
    .whereNotNull('category')
    .where('is_active', true)
    .orderBy('category', 'asc');

  return categories.map((row: any) => row.category);
};
