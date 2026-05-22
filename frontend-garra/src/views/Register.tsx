import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { persistAuthToken } from '../auth/session';
import { AuthService } from '../services/api';
import { toast } from 'sonner';

export default function Register() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      try {
        await AuthService.register({ login, senha, role: 'USER' });
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error('Este login já está em uso.');
        } else {
          toast.error('Não foi possível cadastrar. Verifique o backend e tente novamente.');
        }
        return;
      }

      try {
        const { data } = await AuthService.login({ login, senha });
        const token = data?.token;
        if (token && persistAuthToken(token)) {
          toast.success('Conta criada! Você já está no painel.');
          navigate('/', { replace: true });
          return;
        }
        toast.error('Conta criada, mas o login automático falhou. Entre manualmente.');
        navigate('/login', { replace: true });
      } catch (error) {
        console.error(error);
        toast.error('Conta criada, mas o login automático falhou. Entre manualmente.');
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Login</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
