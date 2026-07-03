import { Component } from '@angular/core';

import { FinanceiroEntradaListComponent } from '../financeiro-entrada-list/financeiro-entrada-list.component';
import { FinanceiroSaidaListComponent } from '../financeiro-saida-list/financeiro-saida-list.component';

/**
 * Página "Transações": reúne as listagens de Entradas e Saídas já existentes
 * (sessão 03) em vez de duplicar a lógica/tabela de cada uma.
 */
@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [FinanceiroEntradaListComponent, FinanceiroSaidaListComponent],
  templateUrl: './transacoes.component.html',
})
export class TransacoesComponent {}
