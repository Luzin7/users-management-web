# Sistema de Gerenciamento de Usuários

Sistema completo de gerenciamento de usuários desenvolvida como parte de um teste técnico para a Conéctar em ReactJS com TypeScript, integrado a um [backend NestJS](https://github.com/Luzin7/users-management.git) via API REST com autenticação JWT.

## 🚀 Funcionalidades

### Autenticação

- **Login**: Autenticação por email e senha com JWT
- **Cadastro**: Registro de novos usuários
- **Controle de Acesso**: Redirecionamento baseado no cargo do usuário (admin/user)
- **Logout**: Encerramento de sessão

### Dashboard Admin

- Listagem completa de usuários
- Filtros por cargo (admin/user)
- Busca por nome
- Ordenação por nome ou data de criação
- Ações de exclusão de usuários

### Perfil do Usuário

- Visualização de dados pessoais
- Edição de nome e senha
- Informações de conta

## 🛠️ Tecnologias Utilizadas

- **Frontend**: ReactJS, TypeScript
- **Roteamento**: React Router
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Zustand
- **Ícones**: Lucide
- **Validação**: Zod com React Hook Form
- **Build**: Vite

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js v22.11 ou superior
- bun ou npm

### Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/Luzin7/users-management-web.git

cd users-management-web
```

2. **Instale as dependências:**

```bash
npm i
# ou
bun i
```

3. **Configure as variáveis de ambiente:**

- Copie o arquivo `.env.example` para `.env` e substitua da forma que achar melhor os valores. Deixei os valores padrões para que seja mais fácil a experiência de teste local.

## Execução da Aplicação

- **Modo desenvolvimento:**

  ```bash
  bun run dev
  # ou
  npm run dev
  ```

- **Modo produção:**

  ```bash
  bun run build
  bun run start
  # ou
  npm run build
  npm start
  ```

O sistema estará disponível em `http://localhost:3001` (ou na porta que você substituiu no seu `.env`).

## Estrutura do Projeto

```
src/
├─ components/         # Componentes reutilizáveis da interface
│  ├─ ui/              # Componentes de UI (alert, toast, etc)
├─ env/                # Configurações de ambiente
├─ hooks/              # Custom hooks do React
├─ lib/                # Bibliotecas utilitárias
├─ pages/              # Páginas principais da aplicação
├─ services/           # Serviços de integração e lógica de negócio
│  ├─ api/             # Configuração e módulos da API
│  │  ├─ modules/      # Módulos específicos da API (ex: users)
│  ├─ auth/            # Lógica de autenticação
│  └─ utils/           # Utilitários dos serviços
├─ stores/             # Gerenciamento de estado (Zustand)
├─ utils/              # Funções utilitárias gerais
│  ├─ jwt/             # Manipulação de tokens JWT
├─ App.tsx             # Componente raiz da aplicação
├─ index.css           # Estilos globais
└─ main.tsx            # Ponto de entrada da aplicação

```

## Decisões de Design e Arquitetura

> **Criação do primeiro usuário administrador:**: O enunciado não especifica como deve ser criado o primeiro usuário admin. Por isso, para viabilizar a entrega, implementei a regra de que o primeiro usuário cadastrado será admin e os demais, usuários comuns.

> **Atenção**: Essa decisão é provisória e deve ser validada conforme a necessidade real do projeto. Em um cenário real, o correto seria alinhar esse fluxo com o cliente antes da implementação.

> **Importante:** A criação do primeiro usuário administrador é realizada diretamente no backend.  
> Consulte o [README do backend](https://github.com/Luzin7/users-management.git) para entender o fluxo de criação inicial e as considerações de segurança adotadas.

- **Separação de responsabilidades:** O frontend foi estruturado em camadas claras, facilitando manutenção e escalabilidade.
- **Gerenciamento de estado com Zustand:** Escolhido por ser leve, simples e eficiente para o porte do projeto, evitando complexidade desnecessária.
- **Validação centralizada:** Toda validação de formulários é feita com Zod, garantindo consistência e segurança dos dados.
- **API Service Layer:** Comunicação com o backend encapsulada em serviços, facilitando testes e possíveis mudanças de implementação.
- **Roteamento protegido:** Uso de rotas privadas e controle de acesso por roles diretamente no frontend.
- **Componentização:** Componentes reutilizáveis e desacoplados, especialmente para UI e feedbacks visuais.
- **Responsividade:** Layouts adaptativos desde o início, garantindo boa experiência em qualquer dispositivo.

## 🔐 Segurança

- **Tokens JWT:** Token de acesso no sessionStorage (expiração curta) e refresh token em cookie httpOnly (mais seguro, não acessível via JS).
- **Proteção de rotas:** Autenticação e verificação de roles antes de acessar páginas sensíveis.
- **Sanitização de inputs:** Prevenção de XSS por meio de validação e sanitização dos dados do usuário.
- **Validação rigorosa:** Todos os formulários possuem validação de campos obrigatórios e formatos.
- **Logout automático:** Usuário é deslogado automaticamente em caso de token expirado ou inválido.

## 📱 Responsividade

O sistema é totalmente responsivo, adaptando-se a diferentes tamanhos de tela.

## Funcionalidades do Dashboard

### Filtros e Busca

- Busca por nome
- Filtro por tipo e status (todos, admin, user, inativos)
- Ordenação por nome ou data de criação

### Ações

- Excluir usuário (com confirmação)

## 🚀 Build e Deploy

### Desenvolvimento

```bash
npm run dev
```

### Build de Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## Considerações Finais

Este projeto foi desenvolvido com foco em clareza, organização e boas práticas. Pode lhe servir como base para algo ainda maior.

---
