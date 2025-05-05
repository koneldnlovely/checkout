
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ProductFormValues, generateSlug } from './ProductSchema';
import BasicInfoSection from './components/FormSections/BasicInfoSection';
import ImageSection from './components/FormSections/ImageSection';
import TypeSection from './components/FormSections/TypeSection';
import AppearanceSection from './components/FormSections/AppearanceSection';
import WhatsAppSection from './components/FormSections/WhatsAppSection';
import StatusSection from './components/FormSections/StatusSection';
import FormActions from './components/FormSections/FormActions';

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export function ProductForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  isEditing = false 
}: ProductFormProps) {
  // Watch name to generate slug
  const name = form.watch('name');
  
  // Generate slug when name changes
  useEffect(() => {
    if (name && !isEditing && !form.getValues('slug')) {
      const generatedSlug = generateSlug(name);
      form.setValue('slug', generatedSlug, { shouldDirty: true });
      console.log(`Generated slug: ${generatedSlug} from name: ${name}`);
    }
  }, [name, form, isEditing]);

  // Log form values for debugging
  useEffect(() => {
    console.log('Current form values:', {
      ...form.getValues(),
      useGlobalColors: form.getValues('use_global_colors'),
      buttonColor: form.getValues('button_color'),
      headingColor: form.getValues('heading_color'),
      bannerColor: form.getValues('banner_color')
    });
  }, [form.watch()]);

  const handleSubmit = (values: ProductFormValues) => {
    console.log('Form submitted with values:', values);
    onSubmit(values);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicInfoSection form={form} />
            <ImageSection form={form} />
            <TypeSection form={form} />
            <AppearanceSection form={form} />
            <WhatsAppSection form={form} />
            <StatusSection form={form} />
            <FormActions isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
