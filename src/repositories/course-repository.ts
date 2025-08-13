import { Course } from '../models/course-model';

exports.getAllCourses = async (): Promise<Course[]> => {
  return await Course.query();
};

exports.getCourseBySlug = async (slug: string): Promise<Course> => {
  return await Course.query().findOne({ slug });
};

exports.addCourse = async (data: Partial<Course>): Promise<Course> => {
  return await Course.query().insert(data);
};

exports.updateCourse = async (slug: string, data: Partial<Course>): Promise<Course | undefined> => {
  return await Course.query().patch(data).where('slug', slug).returning('*').first();
};

exports.deleteCourse = async (slug: string): Promise<number> => {
  return await Course.query().delete().where('slug', slug);
};

exports.searchCourses = async (filters: any): Promise<{ courses: Course[], total: number }> => {
  let query = Course.query();

  // Search in title and description
  if (filters.search) {
    query = query.where((builder: any) => {
      builder
        .where('title', 'ILIKE', `%${filters.search}%`)
        .orWhere('description', 'ILIKE', `%${filters.search}%`);
    });
  }

  // Filter by category
  if (filters.category) {
    query = query.where('category', '=', filters.category);
  }

  // Filter by level
  if (filters.level) {
    query = query.where('level', '=', filters.level);
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

  const courses = await query;

  return { courses, total };
};

exports.getCategories = async (): Promise<string[]> => {
  const categories = await Course.query()
    .select('category')
    .distinct()
    .whereNotNull('category')
    .orderBy('category', 'asc');

  return categories.map((row: any) => row.category);
};
