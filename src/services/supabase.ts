import { Order, Product, User } from '../types';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabaseClient';

export { supabase, supabaseUrl, supabaseAnonKey };

export const SUPABASE_PROJECT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PROJECT_ID) ||
  'errpumennbqcszbkpaai';

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;

export interface SupabaseSyncResult {
  success: boolean;
  table?: string;
  error?: string;
  data?: any;
}

/**
 * Saves registered user / producer / consumer data to Supabase
 */
export async function saveUserToSupabase(user: User): Promise<SupabaseSyncResult> {
  try {
    const payload = {
      user_id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      farmer_profile: user.farmerProfile || null,
      customer_profile: user.customerProfile || null,
      created_at: user.createdAt || new Date().toISOString(),
    };

    // Try profiles table
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select();

    if (error) {
      // Try users table
      const { data: uData, error: uErr } = await supabase
        .from('users')
        .upsert(payload, { onConflict: 'user_id' })
        .select();

      if (uErr) {
        console.warn('Supabase profile upsert advisory:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, table: 'users', data: uData };
    }

    return { success: true, table: 'profiles', data };
  } catch (err: any) {
    console.error('Error saving user to Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetch registered users from Supabase if table exists
 */
export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      const { data: uData, error: uErr } = await supabase.from('users').select('*');
      if (uErr || !uData) return null;
      return uData.map(mapDbUserToAppUser);
    }
    if (data && data.length > 0) {
      return data.map(mapDbUserToAppUser);
    }
    return null;
  } catch {
    return null;
  }
}

function mapDbUserToAppUser(row: any): User {
  return {
    id: row.user_id || row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    avatar: row.avatar || (row.role === 'farmer'
      ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'),
    farmerProfile: row.farmer_profile || undefined,
    customerProfile: row.customer_profile || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

/**
 * Saves customer order and sales transactions to Supabase database
 */
export async function saveOrderToSupabase(order: Order): Promise<SupabaseSyncResult> {
  try {
    const orderPayload = {
      order_id: order.id,
      customer_id: order.customerId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      total_amount: order.totalAmount,
      delivery_fee: order.deliveryFee,
      final_amount: order.finalAmount,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      delivery_address: order.deliveryAddress,
      items: order.items,
      estimated_delivery: order.estimatedDelivery,
      created_at: new Date().toISOString(),
    };

    // Insert into 'orders' table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .upsert(orderPayload, { onConflict: 'order_id' })
      .select();

    if (orderError) {
      console.warn('Supabase orders table upsert notice:', orderError.message);
      // Attempt alternative table name if 'sales' table is used
      const { error: salesError } = await supabase
        .from('sales')
        .insert({
          sale_id: order.id,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          amount: order.finalAmount,
          items_summary: order.items.map(i => `${i.quantity}x ${i.productName}`).join(', '),
          status: order.status,
          delivery_city: order.deliveryAddress.city,
          created_at: new Date().toISOString(),
        });

      if (salesError) {
        return {
          success: false,
          error: `${orderError.message} (Note: ensure 'orders' or 'sales' table exists in Supabase)`,
        };
      }

      return {
        success: true,
        table: 'sales',
        data: orderPayload,
      };
    }

    // Record individual item line records in 'sales_items' if table exists
    try {
      const salesItems = order.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        farmer_id: item.farmerId,
        farmer_name: item.farmerName,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
        created_at: new Date().toISOString(),
      }));

      await supabase.from('sales_items').insert(salesItems);
    } catch {
      // Non-blocking secondary table insert
    }

    return {
      success: true,
      table: 'orders',
      data: orderData,
    };
  } catch (err: any) {
    console.error('Error sending order to Supabase:', err);
    return {
      success: false,
      error: err?.message || 'Unknown network error',
    };
  }
}

/**
 * Saves farmer produce / sales listing to Supabase database
 */
export async function saveProductToSupabase(product: Product): Promise<SupabaseSyncResult> {
  try {
    const productPayload = {
      product_id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      unit: product.unit,
      available_quantity: product.availableQuantity,
      farmer_id: product.farmerId,
      farmer_name: product.farmerName,
      farm_name: product.farmName,
      farm_location: product.farmLocation,
      organic_status: product.organicStatus,
      status: product.status,
      images: product.images,
      created_at: product.createdAt || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .upsert(productPayload, { onConflict: 'product_id' })
      .select();

    if (error) {
      console.warn('Supabase products table upsert notice:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      table: 'products',
      data,
    };
  } catch (err: any) {
    console.error('Error saving product to Supabase:', err);
    return {
      success: false,
      error: err?.message || 'Unknown network error',
    };
  }
}

/**
 * Check connectivity to Supabase backend
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok || response.status === 200 || response.status === 404 || response.status === 400) {
      return { connected: true, message: `Connected to Supabase Project: ${SUPABASE_PROJECT_ID}` };
    }
    return { connected: false, message: `Status ${response.status}: check API key or project permissions` };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Network unreachable' };
  }
}

/**
 * Complete SQL script to set up all tables and RLS policies in Supabase SQL editor
 */
export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:
-- 1. Profiles (Farmers & Customers)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  avatar TEXT,
  farmer_profile JSONB,
  customer_profile JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Products (Farmer Harvest Listings)
CREATE TABLE IF NOT EXISTS public.products (
  product_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  available_quantity NUMERIC NOT NULL,
  farmer_id TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farm_name TEXT,
  farm_location TEXT,
  organic_status BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  images JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Orders (Customer Purchases)
CREATE TABLE IF NOT EXISTS public.orders (
  order_id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  final_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Order Placed',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  delivery_address JSONB NOT NULL,
  items JSONB NOT NULL,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. Sales Summary (Farmer & Admin Analytics)
CREATE TABLE IF NOT EXISTS public.sales (
  id BIGSERIAL PRIMARY KEY,
  sale_id TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  amount NUMERIC,
  items_summary TEXT,
  status TEXT,
  delivery_city TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. Sales Items (Itemized breakdown)
CREATE TABLE IF NOT EXISTS public.sales_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT,
  product_id TEXT,
  product_name TEXT,
  farmer_id TEXT,
  farmer_name TEXT,
  quantity NUMERIC,
  unit TEXT,
  unit_price NUMERIC,
  subtotal NUMERIC,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable public Read/Write access (Anon Key)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon all on profiles" ON public.profiles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on orders" ON public.orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on sales" ON public.sales FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on sales_items" ON public.sales_items FOR ALL TO anon USING (true) WITH CHECK (true);
`;
