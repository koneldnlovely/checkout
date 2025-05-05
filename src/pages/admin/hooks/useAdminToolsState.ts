
import { useState, useEffect, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutCustomizationSettings } from "@/types/customization";
import { supabase } from "@/integrations/supabase/client";

export const useAdminToolsState = () => {
  const [settings, setSettings] = useState<CheckoutCustomizationSettings>({
    showBanner: true,
    buttonColor: "#28A745",
    buttonTextColor: "#ffffff",
    buttonText: "Finalizar Pagamento",
    headerMessage: "Oferta por tempo limitado!",
    bannerImageUrl: "",
    headingColor: "#000000",
    bannerColor: "#000000",
    showTimer: true,
    timerEndDate: "",
    timerMessage: "Oferta termina em:",
    timerExpiredMessage: "Oferta expirada!",
    showProduct: true,
    productName: "Produto Digital",
    productDescription: "Descrição do produto...",
    productPrice: 97.0,
    productImageUrl: "",
    showTestimonials: true,
    // Add the missing properties from the interface
    topMessage: "Oferta exclusiva!",
    countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to 24 hours from now
    isDigitalProduct: true,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("checkout_customization")
          .select("*")
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching settings:", error);
          return;
        }

        if (data) {
          setSettings({
            showBanner: data.show_banner,
            buttonColor: data.button_color,
            buttonTextColor: data.button_text_color,
            buttonText: data.button_text,
            headerMessage: data.header_message || "Oferta por tempo limitado!",
            bannerImageUrl: data.banner_image_url || "",
            headingColor: data.heading_color || "#000000",
            bannerColor: data.banner_color || "#000000",
            showTimer: data.show_timer || true,
            timerEndDate: data.timer_end_date || "",
            timerMessage: data.timer_message || "Oferta termina em:",
            timerExpiredMessage:
              data.timer_expired_message || "Oferta expirada!",
            showProduct: data.show_product || true,
            productName: data.product_name || "Produto Digital",
            productDescription:
              data.product_description || "Descrição do produto...",
            productPrice: data.product_price || 97.0,
            productImageUrl: data.product_image_url || "",
            showTestimonials: data.show_testimonials || true,
            // Add the missing properties
            topMessage: data.top_message || "Oferta exclusiva!",
            countdownEndTime: data.countdown_end_time || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isDigitalProduct: data.is_digital_product || true,
          });
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleColorChange = (name: string, color: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: color,
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("checkout_customization")
        .update({
          show_banner: settings.showBanner,
          button_color: settings.buttonColor,
          button_text_color: settings.buttonTextColor,
          button_text: settings.buttonText,
          header_message: settings.headerMessage,
          banner_image_url: settings.bannerImageUrl,
          heading_color: settings.headingColor,
          banner_color: settings.bannerColor,
          show_timer: settings.showTimer,
          timer_end_date: settings.timerEndDate,
          timer_message: settings.timerMessage,
          timer_expired_message: settings.timerExpiredMessage,
          show_product: settings.showProduct,
          product_name: settings.productName,
          product_description: settings.productDescription,
          product_price: settings.productPrice,
          product_image_url: settings.productImageUrl,
          show_testimonials: settings.showTestimonials,
          // Add the missing properties for database update
          top_message: settings.topMessage,
          countdown_end_time: settings.countdownEndTime,
          is_digital_product: settings.isDigitalProduct,
        })
        .eq("id", 1);

      if (error) throw error;

      toast({
        title: "Configurações Salvas",
        description: "As configurações do checkout foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
      });
    }
  };

  return {
    settings,
    handleChange,
    handleSwitchChange,
    handleColorChange,
    handleSave,
  };
};
