
# Pix Flow Checkout - Visão Geral da Arquitetura

## Introdução

O Pix Flow Checkout é um sistema de pagamentos que oferece suporte a métodos de pagamento brasileiros, com foco em PIX e cartão de crédito. O sistema é construído usando React, integrado com Supabase para armazenamento de dados e funções serverless Netlify para integração com a API Asaas de pagamentos.

## Estrutura do Projeto

### Frontend

O frontend é organizado em:

- **pages**: Páginas principais da aplicação
- **components**: Componentes reutilizáveis
- **hooks**: Lógica de estado e efeitos
- **services**: Comunicação com APIs
- **utils**: Funções utilitárias
- **types**: Definições de tipos TypeScript

### Backend

O backend utiliza:

- **Supabase**: Banco de dados e autenticação
- **Netlify Functions**: Funções serverless para integração com Asaas
- **Asaas API**: Processador de pagamentos

## Fluxo de Pagamento

1. **Checkout**: Usuário informa dados pessoais e escolhe método de pagamento
2. **Processamento**:
   - **PIX**: Gera QR Code e chave para pagamento
   - **Cartão**: Processa pagamento via Asaas
3. **Resultado**:
   - **Sucesso**: Redireciona para página de sucesso
   - **Falha**: Redireciona para página de falha com opção de retry

## Principais Componentes

### Módulo de Checkout

- `CheckoutState`: Gerencia o fluxo de checkout
- `PaymentMethodSection`: Controla métodos de pagamento
- `OrderSummary`: Resumo do pedido

### Módulo de Pagamento PIX

- `PixPaymentContainer`: Container principal
- `PixQRCodeDisplay`: Exibição do QR Code
- `PixStatusChecker`: Verificação de status

### Módulo de Cartão

- `CardForm`: Formulário de cartão
- `CardBrandDetector`: Detecção de bandeira
- `RetryCardSubmission`: Reenvio após falha

### Módulo de Retry

- `RetryPaymentPage`: Página para nova tentativa
- `RetryValidation`: Validação de limites
- `RetryLimitMessage`: Mensagens de limite atingido

## Integrações

- **Asaas**: Processamento de pagamentos
- **Supabase**: Armazenamento de dados
- **Facebook Pixel**: Tracking de conversões
- **Google Ads**: Tracking de conversões

## Considerações de Segurança

- Dados sensíveis de cartão são processados pela API Asaas
- Validações de entrada em formulários
- Row-Level Security no Supabase
- Limites de tentativas para retry de pagamentos

## Arquitetura de Dados

### Principais Tabelas

- `orders`: Pedidos realizados
- `card_data`: Dados de tentativas de cartão
- `asaas_payments`: Dados de pagamentos PIX
- `products`: Produtos disponíveis

## Fluxos de Erro

1. **Falha de Pagamento**: Redireciona para FailedPage
2. **Retry de Cartão**: Permite novas tentativas com limite
3. **Expiração de PIX**: Notifica usuário e sugere nova tentativa

## Melhorias Planejadas

- Refatoração para arquivos menores
- Centralização de tratamento de erros
- Abstração de acesso ao Supabase
- Padronização de nomenclatura
- Modularização de funções Netlify
- Implementação de testes automatizados
