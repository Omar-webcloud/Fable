export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const GENRES = [
  "Fiction",
  "Romance",
  "Mystery",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Thriller",
  "Biography",
];

export const ROLES = {
  USER: "user",
  WRITER: "writer",
  ADMIN: "admin",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price Low to High" },
  { value: "price-desc", label: "Price High to Low" },
];
