
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '../ProductSchema';
import { toast } from '@/hooks/use-toast';
import { getProductBySlug, updateProduct } from '@/services/productService';

export const useProductEdit = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      image_url: '',
      banner_image_url: '',
      type: 'physical',
      use_global_colors: true, // Por padrão usa cores globais
      button_color: '#28A745',
      heading_color: '#000000',
      banner_color: '#000000',
      status: true,
      has_whatsapp_support: false,
      whatsapp_number: '',
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        console.error('No slug provided in URL parameters');
        setError(new Error('Slug não informado'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching product with slug:', slug);
        
        const product = await getProductBySlug(slug);
        
        if (!product) {
          console.error('Product not found for slug:', slug);
          throw new Error('Produto não encontrado');
        }

        console.log('Product data loaded:', product);
        setProductId(product.id);

        // Map database data to the form
        form.reset({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: product.price,
          image_url: product.image_url || '',
          banner_image_url: product.banner_image_url || '',
          type: product.type || 'digital',
          use_global_colors: product.use_global_colors === false ? false : true, // If null or undefined, assume true
          button_color: product.button_color || '#28A745',
          heading_color: product.heading_color || '#000000',
          banner_color: product.banner_color || '#000000',
          status: product.status !== false,
          has_whatsapp_support: product.has_whatsapp_support || false,
          whatsapp_number: product.whatsapp_number || '',
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, form]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!productId) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado. Não é possível atualizar o produto.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('[EditProductPage] Submitting product data:', {
        ...data,
        use_global_colors: data.use_global_colors,
        button_color: data.use_global_colors ? null : data.button_color,
        heading_color: data.use_global_colors ? null : data.heading_color, 
        banner_color: data.use_global_colors ? null : data.banner_color,
      });
      
      const updatedProduct = await updateProduct(productId, {
        name: data.name,
        description: data.description || null,
        price: data.price,
        image_url: data.image_url || null,
        banner_image_url: data.banner_image_url || null,
        type: data.type,
        status: data.status,
        slug: data.slug,
        has_whatsapp_support: data.has_whatsapp_support,
        whatsapp_number: data.has_whatsapp_support ? data.whatsapp_number : null,
        use_global_colors: data.use_global_colors,
        button_color: data.use_global_colors ? null : data.button_color,
        heading_color: data.use_global_colors ? null : data.heading_color,
        banner_color: data.use_global_colors ? null : data.banner_color,
      });

      if (!updatedProduct) {
        throw new Error('Falha ao atualizar produto');
      }

      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso!',
      });
      
      navigate('/admin/products');
    } catch (error) {
      console.error('[EditProductPage] Erro ao atualizar produto:', error);
      toast({
        title: 'Erro ao atualizar produto',
        description: 'Ocorreu um erro ao tentar atualizar o produto. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
    isSubmitting
  };
};
