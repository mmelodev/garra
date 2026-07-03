import type { UserRole } from '@models';

export interface JwtPayload {
  iss: string;
  sub: string;
  id: number;
  role: UserRole;
  exp: number;
}

function ehUserRoleValido(valor: unknown): valor is UserRole {
  return valor === 'ADMIN' || valor === 'USER';
}

function ehJwtPayloadValido(valor: unknown): valor is JwtPayload {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const objeto = valor as Record<string, unknown>;
  return (
    typeof objeto['iss'] === 'string' &&
    typeof objeto['sub'] === 'string' &&
    typeof objeto['id'] === 'number' &&
    typeof objeto['exp'] === 'number' &&
    ehUserRoleValido(objeto['role'])
  );
}

/**
 * Decodifica e valida o payload do JWT emitido por `POST /auth/login`
 * (ver `TokenService.gerarToken` no back-end: claims `id`, `role` — o nome
 * do enum, ex. "ADMIN"/"USER", não o `getRole()` minúsculo —, `sub`, `iss`,
 * `exp`). Não existe endpoint `/auth/me`: o token é a única fonte da role
 * do usuário logado.
 *
 * Retorna `null` para qualquer token malformado ou com formato inesperado,
 * em vez de confiar cegamente no resultado do `JSON.parse` como o back-end
 * "prometeu" — é a correção da validação do objeto de autenticação: antes
 * nada validava a forma do payload, então um token corrompido ou de uma
 * versão futura da API com claims diferentes quebraria silenciosamente
 * (ou pior, seria tratado como `any`).
 */
export function decodificarPayloadJwt(token: string): JwtPayload | null {
  const partes = token.split('.');
  if (partes.length !== 3) {
    return null;
  }

  try {
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((caractere) => '%' + caractere.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const payload: unknown = JSON.parse(json);
    return ehJwtPayloadValido(payload) ? payload : null;
  } catch {
    return null;
  }
}
