# Sessão 09 — Formulário de Aluno (create, edit, delete)

## Objetivo
Criar o componente de cadastro/edição de Aluno, cobrindo `POST /aluno`, `PUT /aluno` e `DELETE /aluno/{id}`, seguindo o mesmo padrão já estabelecido em [`ProfessorFormComponent`](../src/app/features/professores/professor-form/professor-form.component.ts).

## Entregáveis

- [`aluno-form.component.ts`](../src/app/features/alunos/aluno-form/aluno-form.component.ts) — componente standalone, formulário reativo via `FormBuilder`, cobre os 3 modos (create/edit/delete) na mesma rota base.
- [`aluno-form.component.html`](../src/app/features/alunos/aluno-form/aluno-form.component.html) — template com validação visual (bordas vermelhas + mensagens), select de Professor, botão de submit com loading state e botão "Excluir" com loading state próprio.
- Rotas em [`app.routes.ts`](../src/app/app.routes.ts): `alunos/novo` trocada do `CadastroPlaceholderComponent` para o componente real; nova rota `alunos/:id/editar` adicionada (ambas com `authGuard` + `adminGuard`).
- [`aluno-list.component.html`](../src/app/features/alunos/aluno-list/aluno-list.component.html) — coluna "Editar" adicionada para admins, mesmo padrão de `professor-list`.

## Decisões

- **Um único componente para create/edit/delete**, diferenciado por `idParaEditar` lido de `ActivatedRoute` (mesmo padrão de `ProfessorFormComponent`/`FinanceiroEntradaFormComponent`). O botão "Excluir" só aparece em modo edição, chama `alunoService.delete(id)` após `confirm()` nativo, e redireciona para `/alunos` em caso de sucesso.
- **Campos desabilitados em modo edição:** `sexo`, `nomeMae`, `nomePai`, `possuiBolsa`, `dataMatricula`, `rg` e `cpf` ficam com `disabled()` no `FormGroup` quando `modoEdicao`, porque `DadosAtualizarAluno` (o DTO de `PUT /aluno`) só aceita `nome`, `professor`, `email`, `whatsapp` e `endereco` — **não existe como persistir esses campos via update** hoje no back-end. Em modo criação todos os campos ficam habilitados normalmente. Idêntico ao raciocínio já documentado para `ProfessorFormComponent`.
- **Select de Professor carregado via `ProfessorService.getAll()`** (retorna `DadosListagemProfessor[]`, só precisa de `id`/`nome` para popular as opções) — carregado em ambos os modos (create e edit), independente do estado do formulário. Opção "Nenhum professor" como default, já que `professorId` é opcional em `DadosAluno` (sem `@NotNull`/`@NotBlank` documentado).
- **`professor: { id } as Professor` no payload de update.** `DadosAtualizarAluno.professor` espera o objeto `Professor` completo (não um `professorId: number` como em `DadosAluno`/criação), mas o back-end só precisa do `id` para resolver a referência JPA `@ManyToOne` — o restante dos campos obrigatórios de `Professor` (`ativo`, `genero`, `dataNascimento`, etc.) não está disponível no front nesse ponto do fluxo. Optei por um cast parcial (`{ id } as Professor`) em vez de buscar o professor completo via uma chamada extra, seguindo a mesma lógica pragmática do `id: 0` já documentado em `DadosProfessor` (create) — vale confirmar com o back-end se enviar só o `id` é de fato suficiente, já que esse fluxo não pôde ser testado ponta a ponta (ver bug de 403 abaixo).
- **`possuiBolsa` como `<select>` Sim/Não, não um checkbox.** O DTO de request (`DadosAluno.possuiBolsa`) é uma `String` obrigatória (`@NotBlank`), não um `boolean`, então o controle do formulário guarda a string `'true'`/`'false'` diretamente (sem conversão), enviada como está no payload. Em modo edição, o valor é pré-preenchido a partir do `boolean` de `DadosAlunoG.possuiBolsa` (`aluno.possuiBolsa ? 'true' : 'false'`) mas o campo fica desabilitado, então nunca é reenviado.
- **`dataMatricula` usa `<input type="date">`**, mesmo padrão de `dataDeEntrada` no formulário de Professor — é um campo de data simples (sem hora), diferente das datas de `FinanceiroEntrada`/`FinanceiroSaida` que usam a máscara `dd/mm/aaaa` + `<input type="time">`.

## Validações sincronizadas com o DTO (`DadosAluno` / `DadosAtualizarAluno`)

| Campo | Regra no back-end | Validação no front |
|---|---|---|
| `nome` | `@NotBlank` | `Validators.required` (ambos os modos) |
| `email` | `@NotBlank` | `Validators.required` + `Validators.email` (ambos os modos) |
| `whatsapp` | `@NotBlank` | `Validators.required` (ambos os modos) |
| `possuiBolsa` | `@NotBlank` (String) | `Validators.required` (só em modo criação — desabilitado em edição) |
| `dataMatricula` | `@NotBlank` (String) | `Validators.required` (só em modo criação — desabilitado em edição) |
| `rg` | `@NotBlank` | `Validators.required` (só em modo criação — desabilitado em edição) |
| `cpf` | `@NotBlank` | `Validators.required` (só em modo criação — desabilitado em edição) |
| `professorId`, `sexo`, `endereco`, `nomeMae`, `nomePai` | opcionais | sem validador |

## Verificação

- **Typecheck:** `npx tsc --noEmit -p tsconfig.app.json` sem erros para o código da aplicação.
- **Preview manual não realizado nesta sessão:** as portas configuradas em `.claude/launch.json` (`3000` e `5173` — as únicas liberadas no CORS do back-end) já estavam em uso por processos reais de outra sessão de trabalho em paralelo. Evitei encerrar esses processos por serem de outra sessão ativa. A estrutura do componente é uma cópia estrutural direta do `ProfessorFormComponent` (já validado manualmente na sessão anterior), então o risco de erro de template/binding é baixo, mas **o fluxo end-to end de submit (create/edit/delete) ainda não foi confirmado ao vivo contra o back-end real** para este formulário especificamente — recomenda-se rodar `ng serve` numa porta liberada no CORS e testar manualmente antes de considerar encerrado.

## 🔴 Bug de back-end já conhecido que também afeta este formulário

Como já documentado em `backend-api.md` (sessão 09, formulário de Professor): `POST /professor`, `PUT /professor` **e `POST /aluno`** retornam `403 Forbidden` mesmo com token ADMIN recém-emitido. Não há motivo para crer que `PUT /aluno`/`DELETE /aluno/{id}` seriam diferentes — o mesmo bloqueio na cadeia de autorização provavelmente afeta os três verbos com corpo (`POST`/`PUT`) também para `/aluno`. `AlunoFormComponent` está implementado seguindo o contrato documentado, mas o fluxo de criação/edição não pode ser validado ponta a ponta até esse bug ser corrigido no back-end.
