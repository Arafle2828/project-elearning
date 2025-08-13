const Model = require('../config/database/orm');

export class Book extends Model {
  static softDelete = true;
  static tableName = 'books';

  id?: number;
  title!: string;
  slug!: string;
  author!: string;
  isbn?: string;
  description?: string;
  category!: string;
  price!: number;
  cover_image?: string;
  file_path?: string;
  published_date?: Date;
  page_count?: number;
  language!: string;
  is_active!: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
