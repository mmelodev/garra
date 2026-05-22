import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeToggle } from './components/ThemeToggle';
import { readSession } from './auth/session';
import { Dashboard } from './views/Dashboard';
import Login from './views/Login';
import Register from './views/Register';

/**
 * Precisa estar dentro de `BrowserRouter`: a cada mudança de rota o `useLocation`
 * força novo render e `readSession()` relê o token (ex.: após login).
 */
function AppShell() {
  useLocation();
  const isAuth = !!readSession();

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/" replace />} />
      </Routes>
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Garra Admin - Gestão Escolar Inteligente</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
