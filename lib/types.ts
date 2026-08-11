export interface Brand {
  id: number
  slug: string
  name_vi: string
  name_en: string
  origin: string
  desc_vi?: string | null
  desc_en?: string | null
  logo_url?: string | null
  sort_order: number
}

export interface Category {
  id: number
  slug: string
  name_vi: string
  name_en: string
  icon?: string | null
  sort_order: number
}

export interface Product {
  id: number
  part_number: string
  slug: string
  name_vi: string
  name_en: string
  brand_id: number
  category_id: number
  series_name: string
  origin: string
  short_desc_vi?: string | null
  short_desc_en?: string | null
  full_desc_vi?: string | null
  full_desc_en?: string | null
  specs_json?: Record<string, string> | null
  applications_json?: string[] | null
  is_featured: boolean
  sort_order: number
  images?: ProductImage[]
  catalog_pdf?: CatalogPDF | null
  brand?: Brand
  category?: Category
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  order: number
  alt_vi?: string | null
  alt_en?: string | null
}

export interface CatalogPDF {
  id: number
  product_id: number
  file_url: string
  file_name: string
  file_size_bytes: number
  page_count?: number | null
}

export interface NewsArticle {
  id: number
  slug: string
  title_vi: string
  title_en?: string | null
  category_vi: string
  category_en?: string | null
  excerpt_vi: string
  excerpt_en?: string | null
  content_vi: string
  content_en?: string | null
  featured_image_url?: string | null
  published_at: string
}

export interface RFQRequest {
  id: number
  name: string
  company?: string | null
  phone: string
  email?: string | null
  province?: string | null
  note?: string | null
  products_json?: Array<{ part_number: string; qty: number }> | null
  code: string
  ip_address?: string | null
  status: string
  created_at: string
}

export interface RFQFormData {
  name: string
  company?: string
  phone: string
  email?: string
  province?: string
  note?: string
}
