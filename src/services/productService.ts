
import { supabase } from '@/integrations/supabase/client';

export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', true);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    console.log('Fetching product by slug in service:', slug);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

export const createProduct = async (productData: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price) || 0,
          type: productData.type || 'digital',
          status: productData.status !== false,
          slug: productData.slug,
          image_url: productData.image_url || '', 
          banner_image_url: productData.banner_image_url || '',
          has_whatsapp_support: productData.has_whatsapp_support,
          whatsapp_number: productData.whatsapp_number,
          use_global_colors: productData.use_global_colors,
          button_color: productData.button_color,
          heading_color: productData.heading_color,
          banner_color: productData.banner_color
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any): Promise<any> => {
  try {
    console.log('Updating product with ID:', id);
    console.log('Product data being sent:', productData);
    
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price) || 0,
        type: productData.type || 'digital',
        status: productData.status !== false,
        slug: productData.slug,
        image_url: productData.image_url || '',
        banner_image_url: productData.banner_image_url || '',
        has_whatsapp_support: productData.has_whatsapp_support,
        whatsapp_number: productData.whatsapp_number,
        use_global_colors: productData.use_global_colors,
        button_color: productData.button_color,
        heading_color: productData.heading_color,
        banner_color: productData.banner_color
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

// Adding fetchProducts function for backwards compatibility
export const fetchProducts = async () => {
  return getProducts();
};

// Adding handleDeleteProduct for compatibility
export const handleDeleteProduct = async (
  product: any, 
  onSuccess?: () => void
): Promise<void> => {
  try {
    if (!product || !product.id) {
      console.error('Invalid product data');
      return;
    }

    const deleted = await deleteProduct(product.id);
    
    if (deleted && onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Error handling product deletion:', error);
  }
};
