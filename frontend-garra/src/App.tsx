import React, { useEffect, useState } from 'react';
import { fetchAlunos, Aluno } from './api';

const App: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Temporariamente desabilitado para evitar chamada autenticada
    // fetchAlunos()
    //   .then(data => setAlunos(data))
    //   .catch(err => setError(err.message))
    //   .finally(() => setLoading(false));
    setLoading(false);
  }, []);

  if (loading) return <div>Carregando alunos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Alunos</h1>
      <ul>
        {alunos.map(a => (
          <li key={a.id}>
            {a.nome} - {a.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
