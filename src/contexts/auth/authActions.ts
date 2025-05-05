
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const signIn = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: 'Login realizado com sucesso',
      description: 'Você está conectado ao painel administrativo.',
    });
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast({
      title: 'Erro ao fazer login',
      description: error.error_description || error.message || 'Ocorreu um erro ao tentar fazer login.',
      variant: 'destructive',
    });
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    toast({
      title: 'Conta criada com sucesso',
      description: 'Verifique seu e-mail para confirmar sua conta.',
    });
  } catch (error: any) {
    console.error('Error signing up:', error);
    toast({
      title: 'Erro ao criar conta',
      description: error.error_description || error.message || 'Ocorreu um erro ao tentar criar a conta.',
      variant: 'destructive',
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast({
      title: 'Erro ao fazer logout',
      description: error.message || 'Ocorreu um erro ao tentar desconectar.',
      variant: 'destructive',
    });
  }
};

export const makeUserAdmin = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);

    if (error) throw error;

    toast({
      title: 'Usuário promovido',
      description: 'O usuário agora tem privilégios de administrador.',
    });
  } catch (error: any) {
    console.error('Error making user admin:', error);
    toast({
      title: 'Erro ao promover usuário',
      description: error.message || 'Ocorreu um erro ao tentar promover o usuário.',
      variant: 'destructive',
    });
  }
};

export const createAdminUser = async (email: string, password: string) => {
  try {
    // First sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (!authData.user) throw new Error('User creation failed');

    // Directly update the profile to be an admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', authData.user.id);

    if (updateError) throw updateError;

    toast({
      title: 'Usuário administrador criado',
      description: `${email} foi criado e promovido a administrador.`,
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    toast({
      title: 'Erro ao criar usuário administrador',
      description: error.error_description || error.message || 'Ocorreu um erro ao tentar criar o usuário administrador.',
      variant: 'destructive',
    });
    throw error;
  }
};

export const checkIfUserIsAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.is_admin ?? false;
  } catch (error) {
    console.error('Error in admin check:', error);
    return false;
  }
};
