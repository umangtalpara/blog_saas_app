export interface SEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
}

export type BlogStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type Visibility = 'public' | 'private';

export interface BlogForm {
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  coverImage: string;
  media: string[];
  videos: string[];
  tags: string[];
  categories: string[];
  status: BlogStatus;
  seo: SEO;
  scheduleAt?: Date;
  allowComments: boolean;
  featured: boolean;
  visibility: Visibility;
}

export interface Blog extends BlogForm {
  _id: string;
  tenantId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
