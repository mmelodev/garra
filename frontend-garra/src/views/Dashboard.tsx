import { useEffect, useState } from 'react';
import { AlunoService, ProfessorService } from '../services/api';
import { Aluno, Professor } from '../interfaces';
import { EntityCard } from '../components/EntityCard';
import { EntityModal } from '../components/EntityModal';
import { EntityDetailsModal } from '../components/EntityDetailsModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
      const [alunos, setAlunos] = useState<Aluno[]>([]);
      const [professores, setProfessores] = useState<Professor[]>([]);
      const [view, setView] = useState<'alunos' | 'professores'>('alunos');
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editData, setEditData] = useState<any>(null);
      
      const [isDetailOpen, setIsDetailOpen] = useState(false);
      const [detailData, setDetailData] = useState<any>(null);

      const [deleteConfig, setDeleteConfig] = useState<{isOpen: boolean, id: number | null, type: 'aluno' | 'professor' | null}>({isOpen: false, id: null, type: null});
      const [isDeleting, setIsDeleting] = useState(false);

      const fetchData = async () => {
            try {
                  const [resA, resP] = await Promise.all([
                        AlunoService.getAll(),
                        ProfessorService.getAll()
                  ]);

                  const listaAlunos = (resA.data.content || []).map((a: any) => ({
                        ...a,
                        whatsapp: a.whatsapp || a.whasapp
                  }));
                  const listaProfessores = resP.data.content || [];

                  setAlunos(listaAlunos);
                  setProfessores(listaProfessores);

            } catch (error) {
                  console.error("Erro ao buscar dados:", error);
                  setAlunos([]);
                  setProfessores([]);
            }
      };

      useEffect(() => { fetchData(); }, []);

      const handleDeleteRequest = (id: number, type: 'aluno' | 'professor') => {
            setDeleteConfig({ isOpen: true, id, type });
      };

      const handleConfirmDelete = async () => {
            if (!deleteConfig.id || !deleteConfig.type) return;
            setIsDeleting(true);
            try {
                  if (deleteConfig.type === 'aluno') {
                        await AlunoService.delete(deleteConfig.id);
                        setAlunos(alunos.filter(a => a.id !== deleteConfig.id));
                        toast.success("Aluno removido com sucesso!");
                  } else {
                        await ProfessorService.delete(deleteConfig.id);
                        setProfessores(professores.filter(p => p.id !== deleteConfig.id));
                        toast.success("Professor removido com sucesso!");
                  }
                  setDeleteConfig({ isOpen: false, id: null, type: null });
            } catch (error) {
                  console.error(error);
                  toast.error("Erro ao deletar registro!");
            } finally {
                  setIsDeleting(false);
            }
      };

      const handleEdit = (data: any) => {
            setEditData(data);
            setIsModalOpen(true);
      };

      const handleClickCard = (data: any) => {
            setDetailData(data);
            setIsDetailOpen(true);
      };

      const handleFetchMore = async (id: number, type: 'aluno' | 'professor') => {
            try {
                  const req = type === 'aluno' ? AlunoService.getInfoG(id) : ProfessorService.getInfoG(id);
                  const res = await req;
                  toast.success("Informações completas carregadas!");
                  return res.data;
            } catch (error) {
                  console.error(error);
                  toast.error("Erro ao buscar informações detalhadas.");
                  throw error;
            }
      };

      const handleCreateNew = () => {
            setEditData(null);
            setIsModalOpen(true);
      };

      const handleSaveModal = async (data: any) => {
            try {
                  if (view === 'alunos') {
                        if (editData) {
                              await AlunoService.update(data);
                              toast.success("Aluno atualizado com sucesso!");
                        } else {
                              await AlunoService.create(data);
                              toast.success("Aluno criado com sucesso!");
                        }
                  } else {
                        if (editData) {
                              await ProfessorService.update(data);
                              toast.success("Professor atualizado com sucesso!");
                        } else {
                              await ProfessorService.create(data);
                              toast.success("Professor criado com sucesso!");
                        }
                  }
                  fetchData();
            } catch (error) {
                  console.error(error);
                  toast.error("Ocorreu um erro ao salvar a entidade.");
                  throw error; 
            }
      };

      return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 p-4 md:p-12 transition-colors duration-300">
                  <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative">
                        <div>
                              <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter transition-colors">Garra<span className="text-indigo-600 dark:text-indigo-400">Admin</span></h1>
                              <p className="text-gray-500 dark:text-gray-400 font-medium mb-4 transition-colors">Gestão acadêmica em tempo real</p>
                              <button 
                                    onClick={handleCreateNew} 
                                    className="flex items-center cursor-pointer gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-200"
                              >
                                    <Plus size={20} />
                                    Novo {view === 'alunos' ? 'Aluno' : 'Professor'}
                              </button>
                        </div>

                        <div className="flex bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-700 transition-colors">
                              <button
                                    onClick={() => setView('alunos')}
                                    className={`px-8 py-3 cursor-pointer rounded-xl font-bold transition-all ${view === 'alunos' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              >
                                    Alunos ({alunos.length})
                              </button>
                              <button
                                    onClick={() => setView('professores')}
                                    className={`px-8 py-3 cursor-pointer rounded-xl font-bold transition-all ${view === 'professores' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              >
                                    Professores ({professores.length})
                              </button>
                        </div>
                  </header>

                  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode='popLayout'>
                              {view === 'alunos' ?
                                    alunos.map(a => <EntityCard key={a.id} data={a} type="aluno" onClickCard={handleClickCard} onDelete={() => handleDeleteRequest(a.id, 'aluno')} />) :
                                    professores.map(p => <EntityCard key={p.id} data={p} type="professor" onClickCard={handleClickCard} onDelete={() => handleDeleteRequest(p.id, 'professor')} />)
                              }
                        </AnimatePresence>
                  </div>

                  <EntityDetailsModal
                        isOpen={isDetailOpen}
                        onClose={() => setIsDetailOpen(false)}
                        data={detailData}
                        type={view === 'alunos' ? 'aluno' : 'professor'}
                        onEdit={handleEdit}
                        onFetchMore={handleFetchMore}
                  />

                  <EntityModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        type={view === 'alunos' ? 'aluno' : 'professor'} 
                        initialData={editData} 
                        onSave={handleSaveModal} 
                  />

                  <ConfirmModal 
                        isOpen={deleteConfig.isOpen}
                        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })}
                        onConfirm={handleConfirmDelete}
                        loading={isDeleting}
                        title="Deseja mesmo excluir?"
                        message={`Tem certeza que deseja apagar os registros deste ${deleteConfig.type}? Esta ação é permanente e não pode ser desfeita.`}
                  />
            </div>
      );
};