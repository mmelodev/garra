import { HttpParams } from '@angular/common/http';
import { PageableParams } from '@models';

/**
 * Monta os query params de paginação no formato que o Spring Data usa para
 * `Pageable` com `@Qualifier` (prefixo + "_" + propriedade), conforme o
 * qualifier documentado por endpoint em backend-api.md (ex.: "p", "paginacao").
 */
export function buildPageableParams(qualifier: string, pageable?: PageableParams): HttpParams {
  let params = new HttpParams();
  if (!pageable) {
    return params;
  }

  const prefixo = `${qualifier}_`;
  if (pageable.page !== undefined) {
    params = params.set(`${prefixo}page`, pageable.page);
  }
  if (pageable.size !== undefined) {
    params = params.set(`${prefixo}size`, pageable.size);
  }
  if (pageable.sort) {
    params = params.set(`${prefixo}sort`, pageable.sort);
  }
  return params;
}
