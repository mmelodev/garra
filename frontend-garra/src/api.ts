// API helpers – assume backend runs on http://localhost:8080
// Vite proxy forwards /api/* to the backend.

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  // other fields can be added as needed
}

/**
 * Fetch the list of alunos from the backend.
 * The backend controller maps to `/alunos` (no `/api` prefix). The Vite proxy
 * is configured to forward any request starting with `/api` to the backend, so we
 * call `/api/alunos` here.
 */
export async function fetchAlunos(): Promise<Aluno[]> {
  const response = await fetch('/api/aluno');
  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Failed to fetch alunos: ${response.status} ${txt}`);
  }
  return response.json();
}
