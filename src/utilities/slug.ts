/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to slug
 * @returns A URL-friendly slug string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending timestamp or random string
 * @param text - The text to convert to slug
 * @param useTimestamp - Whether to use timestamp (default) or random string
 * @returns A unique slug string
 */
export function generateUniqueSlug(text: string, useTimestamp: boolean = true): string {
  const baseSlug = generateSlug(text);
  
  if (useTimestamp) {
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  } else {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomString}`;
  }
}

/**
 * Validate if a string is a valid slug format
 * @param slug - The slug to validate
 * @returns Boolean indicating if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

/**
 * Convert slug back to readable title
 * @param slug - The slug to convert
 * @returns A readable title string
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
