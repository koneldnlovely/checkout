
import { SupabasePaymentData } from './types';

export async function savePaymentData(supabase: any, data: SupabasePaymentData) {
  try {
    console.log('Salvando dados de pagamento no Supabase...');
    console.log(`Order ID: ${data.order_id}, Payment ID: ${data.payment_id}`);
    
    const { data: result, error } = await supabase
      .from('asaas_payments')
      .insert(data)
      .select();
    
    if (error) {
      console.error('Erro detalhado ao salvar no Supabase:', error);
      throw new Error(`Erro ao salvar dados no Supabase: ${error.message}`);
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error);
    throw error;
  }
}

export async function updateOrderAsaasPaymentId(supabase: any, orderId: string, paymentId: string) {
  try {
    console.log(`Atualizando pedido ${orderId} com payment ID ${paymentId}`);
    
    const { error } = await supabase
      .from('orders')
      .update({ asaas_payment_id: paymentId })
      .eq('id', orderId);
    
    if (error) {
      console.error('Erro detalhado ao atualizar pedido:', error);
      throw new Error(`Erro ao atualizar pedido no Supabase: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
}
