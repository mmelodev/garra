import { LowerCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * Destino provisório dos botões "Cadastrar [Professor/Aluno/Entrada/Saída]"
 * exibidos só para ADMIN nas listagens. Os formulários completos de cadastro
 * (campos de `DadosProfessor`/`DadosAluno`/`DadosFinanceiroEntrada`/
 * `DadosFinanceiroSaida`) ficam para uma próxima sessão — aqui só confirma
 * que a navegação condicionada à role está correta, sem implementar cada
 * formulário ainda.
 */
@Component({
  selector: 'app-cadastro-placeholder',
  standalone: true,
  imports: [RouterLink, LowerCasePipe],
  templateUrl: './cadastro-placeholder.component.html',
})
export class CadastroPlaceholderComponent {
  private readonly rota = inject(ActivatedRoute);

  readonly titulo = (this.rota.snapshot.data['titulo'] as string) ?? 'Cadastro';
  readonly voltarPara = (this.rota.snapshot.data['voltarPara'] as string) ?? '/professores';
}
