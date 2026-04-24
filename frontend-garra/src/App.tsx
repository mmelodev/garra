import { Dashboard } from './views/Dashboard'
import { Toaster } from 'sonner'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>
      {/* Toaster: Adiciona aqueles popups coloridos e animados 
          quando você deleta ou edita algo com sucesso 
      */}
      <Toaster position="top-right" richColors closeButton />
      
      {/* Renderiza a nossa View principal que contém a lógica do Spring Boot */}
      <Dashboard />
      
      {/* Rodapé Simples e Elegante */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Garra Admin - Gestão Escolar Inteligente</p>
      </footer>
    </div>
  )
}

export default App