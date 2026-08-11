import { createClient } from '@supabase/supabase-js'

// Client-side Supabase instance
export const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )
}

// Server-side Supabase instance (with service role key)
export const createSupabaseServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: number
          slug: string
          name_vi: string
          name_en: string
          origin: string
          desc_vi: string | null
          desc_en: string | null
          logo_url: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['brands']['Row'], 'id' | 'created_at'>
      }
      categories: {
        Row: {
          id: number
          slug: string
          name_vi: string
          name_en: string
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
      }
      products: {
        Row: {
          id: number
          part_number: string
          slug: string
          name_vi: string
          name_en: string
          brand_id: number
          category_id: number
          series_name: string
          origin: string
          short_desc_vi: string | null
          short_desc_en: string | null
          full_desc_vi: string | null
          full_desc_en: string | null
          specs_json: Record<string, unknown> | null
          applications_json: string[] | null
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'slug'>
      }
      product_images: {
        Row: {
          id: number
          product_id: number
          image_url: string
          order: number
          alt_vi: string | null
          alt_en: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id' | 'created_at'>
      }
      catalog_pdfs: {
        Row: {
          id: number
          product_id: number
          file_url: string
          file_name: string
          file_size_bytes: number
          page_count: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['catalog_pdfs']['Row'], 'id' | 'created_at'>
      }
      news_articles: {
        Row: {
          id: number
          slug: string
          title_vi: string
          title_en: string | null
          category_vi: string
          category_en: string | null
          excerpt_vi: string
          excerpt_en: string | null
          content_vi: string
          content_en: string | null
          featured_image_url: string | null
          published_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['news_articles']['Row'], 'id' | 'created_at' | 'slug'>
      }
      rfq_requests: {
        Row: {
          id: number
          name: string
          company: string | null
          phone: string
          email: string | null
          province: string | null
          note: string | null
          products_json: Array<{ part_number: string; qty: number }> | null
          code: string
          ip_address: string | null
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['rfq_requests']['Row'], 'id' | 'created_at' | 'code'>
      }
    }
  }
}
