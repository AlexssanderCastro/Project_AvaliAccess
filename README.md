<!-- Projeto AvaliAccess / AvaliAccess Project -->

![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-blue)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot-orange)

<h1 align="center">AvaliAccess</h1>


Um sistema para avaliar estabelecimentos segundo critérios de acessibilidade — ajudando pessoas a encontrar locais mais inclusivos.

<h2 align="center">🎯 Proposito</h2>

O objetivo do projeto é permitir que usuários registrem e consultem avaliações sobre a acessibilidade física e digital de estabelecimentos (rampas, banheiros adaptados, sinalização, atendimento inclusivo etc.).

<h2 align="center">✨ Principais Recursos</h2>

- Cadastro e autenticação de usuários.
- Envio de avaliações com nota (rating) e comentário.
- Upload de imagens do estabelecimento.
- Busca e filtros por cidade, nota, categoria e distância.
- Painel administrativo para moderação de conteúdo.

<h2 align="center">🗂 Estrutura do Projeto</h2>

Raiz do repositório:

- `aa-backend/` — Backend Java (Spring Boot) com APIs REST e armazenamento de uploads.
- `aa-frontend/` — Frontend React com TypeScript, consumindo as APIs do backend.
- `uploads/` — Diretório para arquivos enviados (imagens de estabelecimentos).

Resumo das pastas principais:

- `aa-backend/`
	- `src/main/java/` — código Java Spring Boot
	- `src/main/resources/` — configurações e templates
	- `uploads/establishments/` — imagens enviadas
- `aa-frontend/`
	- `src/` — componentes React, páginas, serviços de API
	- `public/` — index.html e assets públicos

<h2 align="center">🛠 Tecnologias</h2>

- Backend: Java 21 e Spring Boot 3.5.x, Maven, Spring MVC, Spring Security, JPA/Hibernate, JWT (jjwt).
- Frontend: React 19, TypeScript 4.9, Create React App (react-scripts), React Router 7, Axios.
- UI: Bootstrap 5 + React-Bootstrap, React Slick (carrossel).
- Banco de dados: PostgreSQL (runtime) e H2 para desenvolvimento local.
- Armazenamento: sistema de arquivos local para uploads.

<h2 align="center">🚀 Como rodar localmente</h2>

Pré-requisitos:

- Java 21 e Maven
- Node.js 16+ e npm / yarn

Executando o backend:

```powershell
cd aa-backend
./mvnw spring-boot:run
```

Executando o frontend:

```bash
cd aa-frontend
npm install
npm start
```

Observação: atualize `application.properties` em `aa-backend` com as credenciais do banco e o path para uploads.

<h2 align="center">🧭 Endpoints principais (exemplos)</h2>

- `GET /api/establishments` — listar estabelecimentos
- `GET /api/establishments/{id}` — obter detalhes
- `POST /api/establishments` — criar estabelecimento (autorizado)
- `POST /api/reviews` — enviar avaliação
- `POST /api/auth/login` — autenticar usuário

---

<h2 align="center">ENGLISH SECTION — Full translation below</h2>

---

An application to rate establishments by accessibility criteria — helping people find more inclusive places.

<h2 align="center">🎯 Purpose</h2>

The project enables users to submit and consult ratings about the physical and digital accessibility of establishments (ramps, adapted restrooms, signage, inclusive service, etc.).

<h2 align="center">✨ Key Features</h2>

- User registration and authentication.
- Submit ratings with score and text review.
- Upload images for establishments.
- Search and filters by city, rating, category and distance.
- Admin panel for content moderation.

<h2 align="center">🗂 Project Structure</h2>

Repository root:

- `aa-backend/` — Java (Spring Boot) backend with REST APIs and upload storage.
- `aa-frontend/` — React + TypeScript frontend consuming backend APIs.
- `uploads/` — folder for uploaded files (establishment images).

Main folders summary:

- `aa-backend/`
	- `src/main/java/` — Spring Boot source code
	- `src/main/resources/` — configuration and templates
	- `uploads/establishments/` — uploaded images
- `aa-frontend/`
	- `src/` — React components, pages, API services
	- `public/` — index.html and public assets

<h2 align="center">🛠 Technologies</h2>

- Backend: Java 21 and Spring Boot 3.5.x, Maven, Spring MVC, Spring Security, JPA/Hibernate, JWT (jjwt).
- Frontend: React 19, TypeScript 4.9, Create React App (react-scripts), React Router 7, Axios.
- UI: Bootstrap 5 + React-Bootstrap, React Slick (carousel).
- Database: PostgreSQL (runtime) and H2 for local dev.
- Storage: local filesystem for uploads.

<h2 align="center">🚀 Running Locally</h2>

Prerequisites:

- Java 21 and Maven
- Node.js 16+ and npm / yarn

Start backend:

```powershell
cd aa-backend
./mvnw spring-boot:run
```

Start frontend:

```bash
cd aa-frontend
npm install
npm start
```

Note: update `application.properties` in `aa-backend` with DB credentials and uploads path.

<h2 align="center">🧭 Example Endpoints</h2>

- `GET /api/establishments` — list establishments
- `GET /api/establishments/{id}` — get details
- `POST /api/establishments` — create establishment (authorized)
- `POST /api/reviews` — submit review
- `POST /api/auth/login` — authenticate user
