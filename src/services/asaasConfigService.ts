
import { supabase } from '@/integrations/supabase/client';

export interface AsaasConfigData {
  id?: number;
  sandbox: boolean;
  sandbox_key: string | null;
  production_key: string | null;
  pix_enabled: boolean | null;
  card_enabled: boolean | null;
  active: boolean | null;
  updated_at?: string | null;
  use_netlify_functions?: boolean | null;
  manual_card_redirect_page?: string | null;
}

/**
 * Retrieves the Asaas configuration from the database
 * @returns The Asaas configuration data
 */
export async function getAsaasConfig(): Promise<AsaasConfigData | null> {
  const { data, error } = await supabase
    .from('asaas_config')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching Asaas config:', error);
    throw error;
  }

  return data as AsaasConfigData | null;
}

/**
 * Updates the Asaas configuration in the database
 * @param config - The updated Asaas configuration data
 * @returns The updated configuration data
 */
export async function updateAsaasConfig(config: Partial<AsaasConfigData>): Promise<AsaasConfigData> {
  // Get the existing record ID if available
  const existingConfig = await getAsaasConfig();
  const id = existingConfig?.id;

  let result;
  
  if (id) {
    // Update existing record
    const { data, error } = await supabase
      .from('asaas_config')
      .update({
        ...config,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating Asaas config:', error);
      throw error;
    }

    result = data as AsaasConfigData;
  } else {
    // Create new record if none exists
    const { data, error } = await supabase
      .from('asaas_config')
      .insert({
        ...config,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating Asaas config:', error);
      throw error;
    }

    result = data as AsaasConfigData;
  }

  return result;
}
