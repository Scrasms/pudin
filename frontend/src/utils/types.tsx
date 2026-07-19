export interface User {
  uid: string;
  username: string;
  image: string;
  joinedAt: string;
}

export interface Book {
  bid: string;
  title: string;
  blurb: string;
  
  // book cover, aspect ratio is 512/800
  image: string;
  written_by: string;
  created_at?: string;
  published_at: string;
  total_likes: number;
  total_reads: number;
  total_chapters: number;
  chapters: Array<Chapter>;
  tags: Array<string>;
}

export interface Chapter {
  number: number;
  title: string;
  created_at?: string;
  published_at: string;
  likes: number;
  reads: number;
}

export interface ShelfBook {
  user: Omit<User, 'uid' | 'joinedAt' >;
  book: Book;
}

export interface Option {
  label: string;
  value: string | number;
}
