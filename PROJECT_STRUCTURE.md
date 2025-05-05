
# Estrutura de Diretórios do Projeto Checkout Seguro

## 📁 src/

### 📁 components/
#### 📁 admin/
##### 📁 pixel-settings/
- **FacebookPixelSection.tsx** - Componente para configuração do Facebook Pixel
- **GoogleAdsSection.tsx** - Componente para configuração do Google Ads
- **PixelFormCard.tsx** - Cartão de formulário para configurações de pixel
- **SubmitButton.tsx** - Botão de submissão para configurações de pixel

### 📁 hooks/
#### 📁 admin/
- **usePixelConfigForm.ts** - Hook para gerenciamento do formulário de configuração de pixels

### 📁 lib/
#### 📁 pixels/
- **googlePixel.ts** - Utilitário para rastreamento de pixel do Google Ads
- **facebookPixel.ts** - Utilitário para rastreamento do Facebook Pixel

### 📁 services/
- **pixelConfigService.ts** - Serviço para gerenciamento de configurações de pixel no Supabase

### 📁 pages/
#### 📁 admin/
- **PixelSettings.tsx** - Página de configurações de pixels de rastreamento
- **PixelSettingsForm.tsx** - Formulário de configuração de pixels
- **PixelSettingsSchema.ts** - Esquema de validação para configurações de pixel

### 📄 Novos Recursos de Rastreamento de Pixels

1. **Configuração de Pixels Independente**:
   - Suporte para Google Ads e Facebook Pixel
   - Configurações armazenadas na tabela `pixel_config` do Supabase
   - Ativação/desativação individual de cada plataforma de rastreamento

2. **Gerenciamento de Eventos de Rastreamento**:
   - Inicialização condicional de pixels
   - Rastreamento de visualizações de página
   - Rastreamento de conversão
   - Suporte para ambiente de produção

3. **Hooks e Serviços**:
   - `usePixelEvents.ts` para gerenciamento de eventos de pixel
   - `pixelConfigService.ts` para busca e atualização de configurações
   
4. **Utilitários de Pixel**:
   - Funções separadas para Google Ads e Facebook Pixel
   - Suporte para diferentes tipos de eventos (visualização de página, início de checkout, compra)

## Detalhes Técnicos

- **Armazenamento de Configurações**:
  - Tabela `pixel_config` no Supabase
  - Colunas:
    - `google_ads_id`: ID do Google Ads
    - `conversion_label`: Label de conversão do Google Ads
    - `facebook_pixel_id`: ID do Facebook Pixel
    - `facebook_token`: Token de acesso do Facebook
    - `google_enabled`: Flag de ativação do Google Ads
    - `facebook_enabled`: Flag de ativação do Facebook Pixel

- **Inicialização de Pixels**:
  - Somente em ambiente de produção
  - Carregamento de script via JavaScript dinâmico
  - Configurações obtidas do banco de dados em tempo real

