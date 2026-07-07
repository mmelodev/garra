import { HttpParams } from '@angular/common/http';
import { PageableParams } from '@models';

/**
 * Monta os query params de paginação. `backend-api.md` documentava um prefixo
 * por qualifier (`p_size`, `paginacao_size`), mas isso foi confirmado incorreto
 * contra o back-end real: os parâmetros são `page`/`size`/`sort` sem prefixo
 * em todos os endpoints paginados (`/professor`, `/aluno`, `/financeiro/entradas`,
 * `/financeiro/saidas`) — com o prefixo, o Spring simplesmente ignora o parâmetro
 * e cai no default (`size=10`), sem erro.
 */
export function buildPageableParams(pageable?: PageableParams): HttpParams {
  let params = new HttpParams();
  if (!pageable) {
    return params;
  }

  if (pageable.page !== undefined) {
    params = params.set('page', pageable.page);
  }
  if (pageable.size !== undefined) {
    params = params.set('size', pageable.size);
  }
  if (pageable.sort) {
    params = params.set('sort', pageable.sort);
  }
  return params;
}
