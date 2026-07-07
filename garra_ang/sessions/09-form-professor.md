# Sessão 09 — Formulário de Professor (create, edit, delete)

## Objetivo
Criar o componente de cadastro/edição de Professor, cobrindo `POST /professor`, `PUT /professor` e `DELETE /professor/{id}`, seguindo o mesmo padrão visual e de validação já estabelecido em `FinanceiroEntradaFormComponent`/`FinanceiroSaidaFormComponent`.

## Entregáveis

- [`professor-form.component.ts`](../src/app/features/professores/professor-form/professor-form.component.ts) — componente standalone, formulário reativo via `FormBuilder`, cobre os 3 modos (create/edit/delete) na mesma rota base.
- [`professor-form.component.html`](../src/app/features/professores/professor-form/professor-form.component.html) — template com validação visual (bordas vermelhas + mensagens), botão de submit com loading state e botão "Excluir" com loading state próprio.
- Rotas em [`app.routes.ts`](../src/app/app.routes.ts): `professores/novo` trocada do `CadastroPlaceholderComponent` para o componente real; nova rota `professores/:id/editar` adicionada (ambas com `authGuard` + `adminGuard`).
- [`professor-list.component.html`](../src/app/features/professores/professor-list/professor-list.component.html) — coluna "Editar" adicionada para admins, mesmo padrão de `financeiro-entrada-list`.
- `ROTULOS_AREA_CONHECIMENTO` adicionado em [`enums.model.ts`](../src/app/models/enums.model.ts) (rótulos PT-BR para `AreaConhecimento`, não existia até então).

## Decisões

- **Um único componente para create/edit/delete**, diferenciado por `idParaEditar` lido de `ActivatedRoute` (mesmo padrão de `FinanceiroEntradaFormComponent`). O botão "Excluir" só aparece em modo edição, chama `professorService.delete(id)` após `confirm()` nativo, e redireciona para `/professores` em caso de sucesso.
- **Campos desabilitados em modo edição:** `rg`, `cpf`, `genero`, `dataNascimento` e `dataDeEntrada` ficam com `disabled()` no `FormGroup` quando `modoEdicao`, porque `DadosAtualizarProfessor` (o DTO de `PUT /professor`) só aceita `nome`, `areaConhecimento`, `email`, `whatsapp`, `dataDeSaida` e `descricao` — **não existe como persistir esses campos via update** hoje no back-end. Em vez de deixar o usuário editar campos que seriam silenciosamente ignorados pelo servidor, o formulário os exibe como somente leitura (visualmente acinzentados) com os dados vindos de `GET /professor/{id}/infoG`. Em modo criação todos os campos ficam habilitados normalmente.
- **`id: 0` enviado em `DadosProfessor` (create).** O DTO de request marca `id` como `@NotNull` mesmo sendo `POST` de criação — já documentado como possível inconsistência do back-end em `professor.model.ts`. Optei por enviar `0` como placeholder em vez de omitir o campo (que quebraria a tipagem `id: number` obrigatória da interface) até confirmar com o back-end se isso é intencional.
- **`genero` como campo de texto livre**, não um `<select>`: não há enum documentado para esse campo no back-end (`domain/enums` só lista `AreaConhecimento`, categorias financeiras, `StatusMensalidade`, `TipoFinanceiroSaida`, `UserRole`) — o valor observado ao carregar o registro seed (`FEMININO`) sugere um enum existe no Java, mas sem confirmação do contrato exato não arrisquei fixar opções erradas no front.
- **`dataNascimento`/`dataDeEntrada`/`dataDeSaida` usam `<input type="date">`** (não a máscara `dd/mm/aaaa` + `<input type="time">` usada nos forms financeiros) — esses campos do Professor não têm componente de hora (são `LocalDate`, não `LocalDateTime` como as datas de `FinanceiroEntrada`/`FinanceiroSaida`), então o date picker nativo é suficiente e mais simples que replicar a máscara customizada.

## Validações sincronizadas com o DTO (`DadosProfessor` / `DadosAtualizarProfessor`)

| Campo | Regra no back-end | Validação no front |
|---|---|---|
| `nome` | `@NotBlank` | `Validators.required` |
| `areaConhecimento` | `@NotNull` (enum) | `Validators.required`, `<select>` populado via `ROTULOS_AREA_CONHECIMENTO` (novo) |
| `rg` | `@NotBlank` | `Validators.required` (só em modo criação — desabilitado em edição) |
| `cpf` | `@NotBlank` | `Validators.required` (só em modo criação — desabilitado em edição) |
| `email` | `@NotBlank` | `Validators.required` + `Validators.email` (ambos os modos) |
| `whatsapp` | `@NotBlank` | `Validators.required` (ambos os modos) |
| `dataDeEntrada` | `@NotBlank` (String) | `Validators.required` (só em modo criação — desabilitado em edição) |
| `genero`, `dataNascimento`, `dataDeSaida`, `descricao` | opcionais | sem validador |

## Verificação (preview manual em `localhost:3000`, back-end real em `localhost:8080`)

1. **Submit vazio (create):** todos os campos obrigatórios (`nome`, `areaConhecimento`, `rg`, `cpf`, `email`, `whatsapp`, `dataDeEntrada`) exibiram borda vermelha + mensagem de erro; nenhuma requisição foi disparada.
2. **Modo edição — carregamento e prefill:** naveguei para `/professores/9/editar` (professor seed "Maria Carla da Silva"); `GET /professor/9/infoG` retornou 200 e todos os campos foram preenchidos corretamente, incluindo `genero: "FEMININO"` e as três datas. Confirmei visualmente (`preview_inspect`) que `rg`/`cpf`/`genero`/`dataNascimento`/`dataDeEntrada` aparecem acinzentados/desabilitados, enquanto `nome`/`areaConhecimento`/`email`/`whatsapp`/`dataDeSaida`/`descricao` continuam editáveis.
3. **Botão "Excluir" — guarda de confirmação:** sobrescrevi `window.confirm` para retornar `false` e cliquei em "Excluir" — nenhuma requisição `DELETE` foi disparada, confirmando que o componente respeita o cancelamento antes de chamar o service. (Não testei o caminho de confirmação real porque o único professor existente no banco de desenvolvimento não pode ser recriado — ver bug abaixo.)
4. **Submit preenchido (create):** preenchi todos os campos obrigatórios e enviei — a requisição `POST /professor` foi montada corretamente (payload, `Content-Type`, header `Authorization: Bearer <token>` todos presentes e corretos no `Network`), mas o back-end respondeu `403 Forbidden`.

## 🔴 Bug de back-end encontrado nesta sessão (bloqueia o fluxo completo)

`POST /professor`, `PUT /professor` e `POST /aluno` retornam `403 Forbidden` mesmo com um token ADMIN **recém-emitido** (login feito via `fetch` direto no navegador segundos antes de cada chamada — não é problema de token expirado nem de interceptor Angular). Isolei o padrão: `DELETE /professor/{id}` com o **mesmo token**, no mesmo teste, retornou `404` (não `403`) para um id inexistente — ou seja, passou pela autorização e chegou à lógica do controller. Isso é uma pista mais específica que o achado já registrado em `backend-api.md` para `/financeiro/*` (que não comparava POST/PUT vs. DELETE): parece que algo na cadeia de segurança trata `POST`/`PUT` diferente de `GET`/`DELETE`, não é um problema de role ou rota específica.

**Efeito no front:** `ProfessorFormComponent` está completo e correto (validação, payload, headers todos confirmados manualmente), mas o fluxo end-to-end de criação/edição não pode ser validado além do que o `Network` mostra, porque o servidor rejeita a chamada antes de qualquer lógica de negócio. Documentei o achado com mais detalhe em [`backend-api.md`](../.claude/context/backend-api.md) (novo bloco antes de `ProfessorController`), incluindo a sugestão de investigar a ordem dos matchers em `SecurityConfiguration` para `POST`/`PUT` vs. `DELETE`/`GET`.

## Notas de execução

- Para testar como ADMIN, registrei um usuário de teste (`admin_form_test`) via `POST /auth/register` com `role: "ADMIN"` diretamente pelo `fetch` do browser, já que o formulário de registro do front não expõe seleção de role (por design, `RegisterComponent` sempre usa o default `USER`).
