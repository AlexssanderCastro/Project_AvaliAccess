# Sistema de Avaliações - AvaliAccess

## 📋 Funcionalidades Implementadas

### Backend (Java/Spring Boot)

1. **Entidade Review**
   - Avaliação com nota de 0 a 5 estrelas
   - Comentário opcional (até 1000 caracteres)
   - 8 características de acessibilidade:
     - Rampa de Acesso
     - Banheiro Adaptado
     - Estacionamento com Vaga para Deficiente
     - Elevador
     - Entrada Acessível
     - Piso Tátil
     - Atendimento em Libras
     - Assentos Adaptados

2. **Repository e Queries**
   - Buscar avaliações por estabelecimento (ordenadas por data)
   - Calcular nota média do estabelecimento
   - Calcular porcentagem de cada característica de acessibilidade
   - Verificar se usuário já avaliou o estabelecimento

3. **Serviços**
   - Criar avaliação (apenas 1 por usuário por estabelecimento)
   - Editar avaliação (apenas o autor)
   - Excluir avaliação (apenas o autor)
   - Atualizar automaticamente nota média do estabelecimento
   - Calcular características de acessibilidade (>50% = verdadeiro)

4. **Endpoints REST**
   - `POST /api/reviews/establishment/{id}` - Criar avaliação
   - `PUT /api/reviews/{id}` - Editar avaliação
   - `DELETE /api/reviews/{id}` - Excluir avaliação
   - `GET /api/reviews/establishment/{id}` - Listar avaliações
   - `GET /api/reviews/establishment/{id}/accessibility` - Obter características

### Frontend (React/TypeScript)

1. **Componentes**
   - `StarRating`: Visualização e seleção de estrelas (0-5)
   - `AccessibilityIcons`: Ícones com tooltips das características
   - `ReviewForm`: Formulário completo com estrelas e checkboxes
   - `ReviewCard`: Card de exibição da avaliação com opções de editar/excluir

2. **Página de Detalhes**
   - Informações completas do estabelecimento
   - Foto do estabelecimento
   - Nota média e número de avaliações
   - Características de acessibilidade (baseadas em consenso >50%)
   - Formulário para adicionar avaliação
   - Lista de todas as avaliações
   - Editar/excluir próprias avaliações

3. **Integração**
   - Cards clicáveis na página Explorar
   - Navegação para detalhes do estabelecimento
   - Autenticação necessária para avaliar
   - Apenas 1 avaliação por usuário por estabelecimento

## 🚀 Como Testar

### 1. Reiniciar o Backend
```bash
cd aa-backend
mvn clean install
mvn spring-boot:run
```

### 2. Verificar Console
Procure pelas mensagens de criação dos usuários de teste:
- Admin: admin@avaliaccess.com / admin123
- Usuário: usuario@avaliaccess.com / usuario123

### 3. Acessar Frontend
```bash
cd aa-frontend
npm start
```

### 4. Fluxo de Teste

#### Passo 1: Explorar e Visualizar
1. Acesse http://localhost:3002/explore
2. Clique em qualquer estabelecimento cadastrado
3. Visualize a página de detalhes (nota atual, características de acessibilidade)

#### Passo 2: Login
1. Faça login com usuario@avaliaccess.com / usuario123
2. Volte para a página de detalhes do estabelecimento

#### Passo 3: Adicionar Avaliação
1. Clique em "Adicionar Avaliação"
2. Selecione as estrelas (0-5)
3. Escreva um comentário (opcional)
4. Marque as características de acessibilidade presentes
5. Clique em "Enviar Avaliação"

#### Passo 4: Verificar Atualização
1. Observe que a nota média foi atualizada
2. As características de acessibilidade aparecem como ícones
3. Sua avaliação aparece na lista
4. Você pode editar ou excluir sua avaliação

#### Passo 5: Testar Consenso
1. Faça logout
2. Login com admin@avaliaccess.com / admin123
3. Adicione outra avaliação no mesmo estabelecimento
4. Marque características diferentes
5. Observe como as características principais mudam com base no consenso (>50%)

#### Passo 6: Testar Limitação
1. Tente adicionar uma segunda avaliação no mesmo estabelecimento
2. Verifique que o sistema impede (mensagem de erro)

## 🎨 Características Visuais

### Ícones de Acessibilidade (com Tooltips)
- 🔼 Rampa de Acesso
- 🚪 Banheiro Adaptado
- 🅿️ Estacionamento Adaptado
- ⬆️ Elevador
- 🚪 Entrada Acessível
- ⊞ Piso Tátil
- 👆 Atendimento em Libras
- 🪑 Assentos Adaptados

### Interações
- Hover nos ícones mostra descrição
- Estrelas interativas para avaliação
- Cards de avaliação com botões de ação
- Formulário responsivo com validação

## 📊 Lógica de Negócio

### Cálculo de Características
- Para cada característica, o sistema calcula a porcentagem de avaliações que a marcaram
- Se ≥50% das avaliações indicam a presença da característica, ela é exibida
- Exemplo: 10 avaliações, 6 marcaram "Rampa" → Rampa é exibida

### Nota Média
- Calculada automaticamente a partir de todas as avaliações
- Atualizada imediatamente ao adicionar/editar/excluir avaliação
- Exibida com 1 casa decimal (ex: 4.3 ⭐)

### Permissões
- Qualquer usuário logado pode avaliar
- Apenas 1 avaliação por usuário por estabelecimento
- Apenas o autor pode editar/excluir sua avaliação
- Admins não têm privilégios especiais para avaliações

## 🔧 Estrutura de Arquivos

### Backend
```
aa-backend/src/main/java/com/avaliaccess/aa_backend/
├── entity/
│   └── Review.java
├── repository/
│   └── ReviewRepository.java
├── dto/
│   ├── ReviewRequest.java
│   ├── ReviewResponse.java
│   └── AccessibilityFeaturesResponse.java
├── service/
│   └── ReviewService.java
└── controller/
    └── ReviewController.java
```

### Frontend
```
aa-frontend/src/
├── types/
│   └── review.ts
├── services/
│   └── reviewApi.ts
├── components/review/
│   ├── StarRating.tsx
│   ├── StarRating.module.css
│   ├── AccessibilityIcons.tsx
│   ├── AccessibilityIcons.module.css
│   ├── ReviewForm.tsx
│   ├── ReviewForm.module.css
│   ├── ReviewCard.tsx
│   └── ReviewCard.module.css
└── pages/establishment/
    ├── EstablishmentDetailPage.tsx
    └── EstablishmentDetailPage.module.css
```

## ✅ Checklist de Funcionalidades

- [x] Backend: Entidade Review com 8 características
- [x] Backend: Repository com queries de cálculo
- [x] Backend: Serviço de avaliações
- [x] Backend: Controller REST
- [x] Backend: Atualização automática de nota média
- [x] Backend: Cálculo de consenso de características
- [x] Frontend: Componente de estrelas
- [x] Frontend: Ícones com tooltips
- [x] Frontend: Formulário de avaliação
- [x] Frontend: Página de detalhes
- [x] Frontend: Cards de avaliação
- [x] Frontend: Navegação clicável
- [x] Integração: CRUD completo de avaliações
- [x] Segurança: Apenas autor pode editar/excluir
- [x] Validação: 1 avaliação por usuário/estabelecimento

## 🎯 Próximos Passos (Sugestões)

1. **Filtros de Avaliação**: Ordenar por nota, data, etc.
2. **Paginação de Avaliações**: Limitar exibição inicial
3. **Denúncia de Avaliações**: Reportar conteúdo inadequado
4. **Fotos nas Avaliações**: Permitir upload de imagens
5. **Curtir Avaliações**: Sistema de "útil/não útil"
6. **Estatísticas**: Gráficos de distribuição de notas
7. **Busca por Acessibilidade**: Filtrar estabelecimentos por características
8. **Histórico**: Ver todas as avaliações do usuário
