# Sessão 09 — Formulário de Saídas Financeiras (create)

## Objetivo
Criar o componente de cadastro de Saída Financeira (`POST /financeiro/saidas`), seguindo o mesmo padrão visual e de validação já estabelecido em `FinanceiroEntradaFormComponent`.

## Entregáveis

- [`financeiro-saida-form.component.ts`](../src/app/features/financeiro/financeiro-saida-form/financeiro-saida-form.component.ts) — componente standalone, formulário reativo via `FormBuilder`.
- [`financeiro-saida-form.component.html`](../src/app/features/financeiro/financeiro-saida-form/financeiro-saida-form.component.html) — template com validação visual.
- Rota `financeiro/saidas/novo` em [`app.routes.ts`](../src/app/app.routes.ts) trocada do `CadastroPlaceholderComponent` para o componente real (mantém `authGuard` + `adminGuard`).
- `ROTULOS_TIPO_FINANCEIRO_SAIDA` adicionado em [`financeiro.model.ts`](../src/app/models/financeiro.model.ts) (rótulos PT-BR para `FIXA`/`VARIAVEL`, no mesmo padrão de `ROTULOS_CATEGORIA_SAIDA`/`ROTULOS_CATEGORIA_ENTRADA`).

## Decisões

- **Só modo create.** Diferente da Entrada, o back-end não expõe (nem tem indício de) `PUT /financeiro/saidas`, e `FinanceiroSaidaService` já documenta isso explicitamente (comentário no topo do arquivo). Não há suposição de endpoint de edição aqui — o formulário é create-only por rota, sem branch de `modoEdicao`.
- **Campo `data` obrigatório e editável**, ao contrário do form de Entrada (onde `data` foi propositalmente omitido — decisão da sessão 06). Motivo: `DadosFinanceiroSaida.data` é `@NotNull` no back-end sem menção de default automático (diferente de `FinanceiroConta.data`/`FinanceiroEntrada`, que default para `now()` quando nulo). Usa o mesmo padrão de máscara dd/mm/aaaa + `<input type="time">` + combinação em `yyyy-MM-ddTHH:mm`, replicado do form de Entrada.
- **`contaId` omitido do DTO enviado.** Campo é opcional em `DadosFinanceiroSaida` e o back-end resolve a conta a partir do usuário autenticado (mesmo padrão do `alunoId`/`conta` implícitos na Entrada).
- **Helpers de máscara duplicados localmente** (`converterValorParaNumero`, `valorEntreLimitesValidator`, `PADRAO_DATA_BR`, `combinarDataHora`, `formatarDigitacaoData`, `formatarValorDigitado`) em vez de extrair para um util compartilhado — não existe um shared util para isso hoje (o form de Entrada também os define localmente), então extrair agora seria refatoração fora do escopo pedido.

## Validações sincronizadas com o DTO (`DadosFinanceiroSaida`)

| Campo | Regra no back-end | Validação no front |
|---|---|---|
| `valor` | `@NotNull @DecimalMin(0.01) @DecimalMax(9999999.99) @Digits(integer=10, fraction=2)` | `Validators.required` + validator customizado de faixa (0,01–9.999.999,99), com máscara monetária na digitação |
| `categoria` | `@NotNull` (enum `FinanceiroSaidaCategoria`) | `Validators.required`, `<select>` populado via `ROTULOS_CATEGORIA_SAIDA` |
| `tipoFinanceiroSaida` | `@NotNull` (enum `TipoFinanceiroSaida`) | `Validators.required`, `<select>` populado via `ROTULOS_TIPO_FINANCEIRO_SAIDA` (novo) |
| `data` | `@NotNull` | `Validators.required` + `Validators.pattern` (dd/mm/aaaa) no campo de data, `Validators.required` no campo de hora |
| `descricao` | opcional | sem validador |
| `contaId` | opcional, resolvido pelo back-end | não exposto no formulário |

## Verificação (preview manual, ambiente já autenticado como ADMIN)

1. Submit vazio → todos os campos obrigatórios (`categoria`, `tipoFinanceiroSaida`, `valor`, `data`, `hora`) exibiram borda vermelha + mensagem de erro; nenhuma requisição foi disparada.
2. Preenchimento válido (`Material` / `Fixa` / `150,00` / `07/07/2026` / `14:30` / descrição livre) → máscaras confirmadas (`15000` dígitos → `150,00`; `07072026` → `07/07/2026`).
3. Submit → `POST http://localhost:8080/financeiro/saidas` retornou `201`; botão exibiu estado de loading ("Salvando...") durante a chamada.
4. Redirecionamento automático para `/financeiro/saidas`; a listagem recarregou e exibiu a nova linha: `07/07/2026 - 14:30 | MATERIAL | FIXA | Teste automatizado de saída | R$150.00` — dados batem exatamente com o que foi enviado (sem a rotação de campos de data que afeta `/financeiro/entradas`, já que `DadosFinanceiroSaida` só tem um campo de data).

## Sugestão para o back-end (fora do escopo do front)

Nenhuma nova encontrada nesta sessão — `POST /financeiro/saidas` funcionou de primeira, sem o 403 documentado para `/financeiro/entradas` (ver `backend-api.md`) nem a rotação de campos de data (que não se aplica aqui, já que só existe um campo `data`).
