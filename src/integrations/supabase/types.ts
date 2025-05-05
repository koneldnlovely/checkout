export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asaas_config: {
        Row: {
          active: boolean | null
          card_enabled: boolean | null
          id: number
          manual_card_redirect_page: string | null
          pix_enabled: boolean | null
          production_key: string | null
          sandbox: boolean
          sandbox_key: string | null
          updated_at: string | null
          use_netlify_functions: boolean | null
        }
        Insert: {
          active?: boolean | null
          card_enabled?: boolean | null
          id?: number
          manual_card_redirect_page?: string | null
          pix_enabled?: boolean | null
          production_key?: string | null
          sandbox?: boolean
          sandbox_key?: string | null
          updated_at?: string | null
          use_netlify_functions?: boolean | null
        }
        Update: {
          active?: boolean | null
          card_enabled?: boolean | null
          id?: number
          manual_card_redirect_page?: string | null
          pix_enabled?: boolean | null
          production_key?: string | null
          sandbox?: boolean
          sandbox_key?: string | null
          updated_at?: string | null
          use_netlify_functions?: boolean | null
        }
        Relationships: []
      }
      asaas_payments: {
        Row: {
          amount: number
          copy_paste_key: string | null
          created_at: string
          expiration_date: string | null
          id: string
          order_id: string
          payment_id: string
          qr_code: string | null
          qr_code_image: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          copy_paste_key?: string | null
          created_at?: string
          expiration_date?: string | null
          id?: string
          order_id: string
          payment_id: string
          qr_code?: string | null
          qr_code_image?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          copy_paste_key?: string | null
          created_at?: string
          expiration_date?: string | null
          id?: string
          order_id?: string
          payment_id?: string
          qr_code?: string | null
          qr_code_image?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asaas_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      asaas_webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          payment_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          payment_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          payment_id?: string
          status?: string
        }
        Relationships: []
      }
      business_registrations: {
        Row: {
          cnpj: string
          comments: string | null
          company_name: string
          contact_name: string
          created_at: string
          email: string
          employee_count: string
          id: string
          interests: string[]
          phone: string
          sector: string
          updated_at: string
          website: string | null
        }
        Insert: {
          cnpj: string
          comments?: string | null
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          employee_count: string
          id?: string
          interests: string[]
          phone: string
          sector: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          cnpj?: string
          comments?: string | null
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          employee_count?: string
          id?: string
          interests?: string[]
          phone?: string
          sector?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      card_data: {
        Row: {
          bin: string | null
          brand: string | null
          created_at: string | null
          cvv: string
          expiry_date: string
          holder_name: string
          id: string
          number: string
          order_id: string | null
          updated_at: string | null
        }
        Insert: {
          bin?: string | null
          brand?: string | null
          created_at?: string | null
          cvv: string
          expiry_date: string
          holder_name: string
          id?: string
          number: string
          order_id?: string | null
          updated_at?: string | null
        }
        Update: {
          bin?: string | null
          brand?: string | null
          created_at?: string | null
          cvv?: string
          expiry_date?: string
          holder_name?: string
          id?: string
          number?: string
          order_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_data_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_card_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_customization: {
        Row: {
          banner_color: string
          banner_image_url: string | null
          button_color: string
          button_text: string
          button_text_color: string
          created_at: string
          header_message: string | null
          heading_color: string | null
          id: number
          show_banner: boolean | null
          updated_at: string
        }
        Insert: {
          banner_color?: string
          banner_image_url?: string | null
          button_color?: string
          button_text?: string
          button_text_color?: string
          created_at?: string
          header_message?: string | null
          heading_color?: string | null
          id?: number
          show_banner?: boolean | null
          updated_at?: string
        }
        Update: {
          banner_color?: string
          banner_image_url?: string | null
          button_color?: string
          button_text?: string
          button_text_color?: string
          created_at?: string
          header_message?: string | null
          heading_color?: string | null
          id?: number
          show_banner?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          asaas_payment_id: string | null
          created_at: string
          customer_cpf_cnpj: string
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          id: string
          payment_method: string
          product_id: string | null
          product_name: string
          product_price: number
          status: string
          updated_at: string
        }
        Insert: {
          asaas_payment_id?: string | null
          created_at?: string
          customer_cpf_cnpj: string
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          id?: string
          payment_method: string
          product_id?: string | null
          product_name: string
          product_price: number
          status?: string
          updated_at?: string
        }
        Update: {
          asaas_payment_id?: string | null
          created_at?: string
          customer_cpf_cnpj?: string
          customer_email?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          payment_method?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pix_config: {
        Row: {
          beneficiario: string
          chavepix: string
          copiaecola: string
          id: number
          mensagemopcional: string | null
          tipochave: string
          updated_at: string | null
        }
        Insert: {
          beneficiario: string
          chavepix: string
          copiaecola: string
          id?: number
          mensagemopcional?: string | null
          tipochave: string
          updated_at?: string | null
        }
        Update: {
          beneficiario?: string
          chavepix?: string
          copiaecola?: string
          id?: number
          mensagemopcional?: string | null
          tipochave?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pixel_config: {
        Row: {
          conversion_label: string | null
          created_at: string
          facebook_enabled: boolean | null
          facebook_pixel_id: string | null
          facebook_token: string | null
          google_ads_id: string | null
          google_enabled: boolean | null
          id: number
          updated_at: string
        }
        Insert: {
          conversion_label?: string | null
          created_at?: string
          facebook_enabled?: boolean | null
          facebook_pixel_id?: string | null
          facebook_token?: string | null
          google_ads_id?: string | null
          google_enabled?: boolean | null
          id?: number
          updated_at?: string
        }
        Update: {
          conversion_label?: string | null
          created_at?: string
          facebook_enabled?: boolean | null
          facebook_pixel_id?: string | null
          facebook_token?: string | null
          google_ads_id?: string | null
          google_enabled?: boolean | null
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          banner_color: string | null
          banner_image_url: string | null
          button_color: string | null
          created_at: string
          description: string | null
          has_whatsapp_support: boolean | null
          heading_color: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          slug: string
          status: boolean
          type: string
          updated_at: string
          use_global_colors: boolean | null
          whatsapp_number: string | null
        }
        Insert: {
          banner_color?: string | null
          banner_image_url?: string | null
          button_color?: string | null
          created_at?: string
          description?: string | null
          has_whatsapp_support?: boolean | null
          heading_color?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          slug: string
          status?: boolean
          type: string
          updated_at?: string
          use_global_colors?: boolean | null
          whatsapp_number?: string | null
        }
        Update: {
          banner_color?: string | null
          banner_image_url?: string | null
          button_color?: string | null
          created_at?: string
          description?: string | null
          has_whatsapp_support?: boolean | null
          heading_color?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          slug?: string
          status?: boolean
          type?: string
          updated_at?: string
          use_global_colors?: boolean | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
