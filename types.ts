export enum ContentType {
  BLOG_POST = "Blog Post",
  SOCIAL_MEDIA = "Social Media Post",
  AD_COPY = "Ad Copy",
  EMAIL_NEWSLETTER = "Email Newsletter",
  PRODUCT_DESCRIPTION = "Product Description",
  LANDING_PAGE = "Landing Page Copy",
  VIDEO_SCRIPT = "Video Script",
  SALES_PAGE = "Sales Page"
}

export enum Tone {
  PROFESSIONAL = "Professional",
  CONVERSATIONAL = "Conversational",
  HUMOROUS = "Humorous",
  INSPIRATIONAL = "Inspirational",
  EDUCATIONAL = "Educational",
  CASUAL = "Casual"
}

export interface GenerationParams {
  topic: string;
  contentType: ContentType;
  audience: string;
  tone: Tone;
  wordCount: string;
  specialRequirements: string;
}

export interface GenerationResult {
  id: string;
  content: string;
  timestamp: number;
  params: GenerationParams;
}

export interface Preset {
  id: string;
  name: string;
  params: GenerationParams;
}

export interface HistoryItem extends GenerationResult {}