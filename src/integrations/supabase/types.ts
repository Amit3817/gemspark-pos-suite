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
      bills: {
        Row: {
          bill_no: string
          carat: string | null
          created_at: string
          customer_name: string
          date: string
          gold_price_per_10g: number | null
          gst_percent: number | null
          id: string
          making_charges: number | null
          making_charges_percent: number | null
          metal_type: string | null
          phone_number: string | null
          product_id: string | null
          product_name: string | null
          rate_per_g: number | null
          silver_price_per_10g: number | null
          total_amount: number | null
          updated_at: string
          weight_g: number | null
        }
        Insert: {
          bill_no: string
          carat?: string | null
          created_at?: string
          customer_name: string
          date?: string
          gold_price_per_10g?: number | null
          gst_percent?: number | null
          id?: string
          making_charges?: number | null
          making_charges_percent?: number | null
          metal_type?: string | null
          phone_number?: string | null
          product_id?: string | null
          product_name?: string | null
          rate_per_g?: number | null
          silver_price_per_10g?: number | null
          total_amount?: number | null
          updated_at?: string
          weight_g?: number | null
        }
        Update: {
          bill_no?: string
          carat?: string | null
          created_at?: string
          customer_name?: string
          date?: string
          gold_price_per_10g?: number | null
          gst_percent?: number | null
          id?: string
          making_charges?: number | null
          making_charges_percent?: number | null
          metal_type?: string | null
          phone_number?: string | null
          product_id?: string | null
          product_name?: string | null
          rate_per_g?: number | null
          silver_price_per_10g?: number | null
          total_amount?: number | null
          updated_at?: string
          weight_g?: number | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          customer_id: string
          email: string | null
          id: string
          last_visit: string | null
          name: string
          phone: string | null
          status: string | null
          total_purchases: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          email?: string | null
          id?: string
          last_visit?: string | null
          name: string
          phone?: string | null
          status?: string | null
          total_purchases?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          total_purchases?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string
          current_stock: number | null
          id: string
          last_updated: string
          minimum_stock: number | null
          product_id: string
          product_name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_stock?: number | null
          id?: string
          last_updated?: string
          minimum_stock?: number | null
          product_id: string
          product_name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_stock?: number | null
          id?: string
          last_updated?: string
          minimum_stock?: number | null
          product_id?: string
          product_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          carat: string | null
          category: string
          created_at: string
          id: string
          metal_type: string | null
          notes: string | null
          product_id: string
          product_name: string
          quantity: number | null
          rate_per_g: number | null
          updated_at: string
          weight_g: number | null
        }
        Insert: {
          carat?: string | null
          category: string
          created_at?: string
          id?: string
          metal_type?: string | null
          notes?: string | null
          product_id: string
          product_name: string
          quantity?: number | null
          rate_per_g?: number | null
          updated_at?: string
          weight_g?: number | null
        }
        Update: {
          carat?: string | null
          category?: string
          created_at?: string
          id?: string
          metal_type?: string | null
          notes?: string | null
          product_id?: string
          product_name?: string
          quantity?: number | null
          rate_per_g?: number | null
          updated_at?: string
          weight_g?: number | null
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
