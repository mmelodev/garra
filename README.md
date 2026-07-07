# Garra

Sistema de gestão para o cursinho **Garra**, localizado em Belém-PA. Automatiza o controle de alunos, professores, carga horária e a gestão financeira (entradas e saídas) da empresa.

O projeto é dividido em dois módulos: uma API REST em **Spring Boot** (raiz do repositório) e um front-end em **Angular** (`garra_ang/`).

## Stack

**Backend**
- Java 21, Spring Boot 4.0.5 (Web MVC, Data JPA, Security, Validation)
- PostgreSQL (driver `org.postgresql`)
- Autenticação via JWT (`com.auth0:java-jwt`)
- Lombok
- springdoc-openapi (Swagger UI)
- Maven (wrapper incluso, Maven 3.9.14)

**Frontend**
- Angular 17 (standalone components, lazy-loaded routes)
- TypeScript, RxJS, Tailwind CSS
- Chart.js / ng2-charts para os gráficos do dashboard
- Angular CDK

## Estrutura do backend

```
src/main/java/br/com/garra/
├── GarraApplication.java
├── config/            CorsConfiguration
├── controller/         AutenticacaoController, AlunoController, ProfessorController, FinanceiroController
├── domain/
│   ├── entity/          Aluno, Professor, Usuario, FinanceiroConta, FinanceiroEntrada, FinanceiroSaida
│   ├── model/            DTOs de entrada (records) para cadastro/atualização
│   ├── dto/               DTOs de saída (listagem, "G" = detalhe geral)
│   ├── enums/            UserRole, AreaConhecimento, StatusMensalidade, FinanceiroEntradaCategoria, FinanceiroSaidaCategoria, TipoFinanceiroSaida
│   └── validation/        ValidacaoEvento, ValidacaoMatricula, ValidacaoMensalidade, ValidarEntradaFinanceira
├── repository/           AlunoRepository, ProfessorRepository, UsuarioRepository, ContaRepository, FinanceiroEntradaRepository, FinanceiroSaidaRepository
├── service/               AlunoService, ProfessorService, FinanceiroService, UsuarioService, AutenticacaoService, TokenService
├── infra/
│   ├── security/           SecurityConfiguration, SecurityFilter, TokenJWT
│   ├── exception/          HttpExceptionHandler
│   └── springdoc/           SpringDocConfigurations
└── exeption/              ValidacaoException
```

### Modelo de domínio

- **Professor** — dados pessoais, `areaConhecimento` (enum: Matemática, Redação, Física, Química, Português, Literatura, História, Geografia, Biologia), datas de entrada/saída, flag `ativo` (soft delete) e lista de alunos vinculados.
- **Aluno** — dados pessoais, `professor` vinculado (`ManyToOne`), flag `possuiBolsa`, data de matrícula, flag `ativo` (soft delete), e histórico de entradas financeiras.
- **Usuario** — implementa `UserDetails` do Spring Security; possui `login`, `senha` (hash BCrypt) e `role` (`ADMIN`/`USER`), com uma `FinanceiroConta` associada (`OneToOne`).
- **FinanceiroConta** — saldo consolidado, com listas de entradas e saídas financeiras.
- **FinanceiroEntrada** — categorias: Mensalidade, Matrícula, Material didático, Evento, Doação, Outros; possui `StatusMensalidade` (Pendente, Pago, Atrasado).
- **FinanceiroSaida** — categorias: Aluguel, Material, Marketing, Manutenção, Impostos, Outros; tipo Fixa ou Variável.

### Endpoints da API

Todos os endpoints (exceto login/registro) exigem token JWT no header `Authorization`.

| Método | Rota | Papel exigido | Descrição |
|---|---|---|---|
| POST | `/auth/login` | público | Autentica e retorna token JWT |
| POST | `/auth/register` | público (temporário) | Cadastra usuário |
| POST | `/aluno` | ADMIN | Cadastra aluno |
| GET | `/aluno` | USER, ADMIN | Lista alunos ativos (paginado, ordenado por nome) |
| GET | `/aluno/{id}/infoG` | autenticado | Detalhe completo do aluno |
| PUT | `/aluno` | ADMIN | Atualiza aluno |
| DELETE | `/aluno/{id}` | ADMIN | Inativa aluno (soft delete) |
| POST | `/professor` | ADMIN | Cadastra professor |
| GET | `/professor` | USER, ADMIN | Lista professores ativos (paginado, ordenado por nome) |
| GET | `/professor/{id}/infoG` | autenticado | Detalhe completo do professor |
| PUT | `/professor` | ADMIN | Atualiza professor |
| DELETE | `/professor/{id}` | ADMIN | Inativa professor (soft delete) |
| GET | `/professor/area/{area}` | autenticado | Lista professores por área de conhecimento |
| POST | `/financeiro/entradas` | ADMIN | Registra entrada financeira |
| GET | `/financeiro/entradas` | autenticado | Lista entradas (paginado, ordenado por data) |
| GET | `/financeiro/entradas/{id}` | autenticado | Detalhe de uma entrada |
| POST | `/financeiro/saidas` | ADMIN | Registra saída financeira |
| GET | `/financeiro/saidas` | autenticado | Lista saídas (paginado, ordenado por data) |
| GET | `/financeiro/saidas/{id}` | autenticado | Detalhe de uma saída |
| GET | `/financeiro/saldo` | autenticado | Saldo consolidado da conta |

Documentação interativa (Swagger UI) disponível em `/swagger-ui.html` quando a aplicação está rodando.

### Configuração (`application.properties`)

```
spring.application.name=garra
spring.datasource.url=jdbc:postgresql://localhost:5432/garra
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.jpa.hibernate.ddl-auto=update
api.security.token=${JWT_TOKEN_PASS}
server.port=8080
```

Requer as variáveis de ambiente `DB_USER`, `DB_PASS` e `JWT_TOKEN_PASS`, e um banco PostgreSQL `garra` rodando em `localhost:5432`.

CORS liberado para `http://localhost:5173`, `http://localhost:3000` e `http://localhost:4200`.

### Rodando o backend

```bash
./mvnw spring-boot:run
```

Testes:

```bash
./mvnw test
```

## Estrutura do frontend (`garra_ang/`)

```
src/app/
├── core/
│   ├── guards/          auth.guard.ts (authGuard, adminGuard, guestGuard)
│   ├── interceptors/     auth.interceptor.ts
│   └── services/          sessao.service.ts, jwt.util.ts, pageable.util.ts, http-error-handler.service.ts
├── design-system/        colors.scss, typography.scss, spacing.scss, tokens.ts
├── features/
│   ├── auth/               login, register, autenticacao.service.ts
│   ├── dashboard/          dashboard + componentes de gráficos (cash-flow-chart, expenses-donut, card-panel, last-transaction, upcoming-bills)
│   ├── alunos/              aluno-list, aluno-form, aluno.service.ts
│   ├── professores/        professor-list, professor-form, professor.service.ts
│   └── financeiro/          transacoes, financeiro-entrada-list/form, financeiro-saida-list/form, services de conta/entrada/saída
├── layout/               shell.component, sidebar.component
├── models/                 aluno, professor, usuario, financeiro, enums, shared
├── shared/components/      ui-card, ui-button, ui-badge, ui-dropdown, ui-icon, ui-metric-card, ui-bill-item, cadastro-placeholder
└── app.routes.ts / app.config.ts / app.component.ts
```

### Rotas principais

| Rota | Guard | Componente |
|---|---|---|
| `/login` | guestGuard | LoginComponent |
| `/registro` | guestGuard | RegisterComponent |
| `/dashboard` | authGuard | dashboard.routes (lazy) |
| `/professores` | authGuard | ProfessorListComponent |
| `/professores/novo`, `/professores/:id/editar` | authGuard + adminGuard | ProfessorFormComponent |
| `/alunos` | authGuard | AlunoListComponent |
| `/alunos/novo`, `/alunos/:id/editar` | authGuard + adminGuard | AlunoFormComponent |
| `/financeiro/transacoes` | authGuard | TransacoesComponent |
| `/financeiro/entradas`, `/financeiro/entradas/novo`, `/financeiro/entradas/:id/editar` | authGuard (+adminGuard nas mutações) | Financeiro Entrada List/Form |
| `/financeiro/saidas`, `/financeiro/saidas/novo` | authGuard (+adminGuard nas mutações) | Financeiro Saida List/Form |

Rota raiz redireciona para `/login`. Controle de acesso de rotas administrativas (cadastro/edição) restrito via `adminGuard`.

### Configuração

`src/environments/environment.ts` e `environment.development.ts` apontam `apiUrl` para `http://localhost:8080` (a API Spring Boot).

### Rodando o frontend

```bash
cd garra_ang
npm install
npm start        # ng serve — http://localhost:4200
npm run build    # build de produção em dist/
npm test         # testes unitários via Karma
```

## Rodando o projeto completo

1. Subir um PostgreSQL local com banco `garra` e definir `DB_USER`, `DB_PASS`, `JWT_TOKEN_PASS`.
2. Backend: `./mvnw spring-boot:run` (porta 8080).
3. Frontend: `cd garra_ang && npm install && npm start` (porta 4200).
