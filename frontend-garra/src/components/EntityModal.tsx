import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, GraduationCap } from 'lucide-react';
import { AreaConhecimento, Professor } from '../interfaces';
import { ProfessorService } from '../services/api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: 'aluno' | 'professor';
    initialData?: any; // Pode ser DadosAtualizar ou null para Create
    onSave: (data: any) => Promise<void>;
}

export const EntityModal = ({ isOpen, onClose, type, initialData, onSave }: Props) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    // Estados para seleção de professor
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [searchProfessor, setSearchProfessor] = useState('');
    const [isProfessorListOpen, setIsProfessorListOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {});
            setSearchProfessor('');
            setIsProfessorListOpen(false);

            if (type === 'aluno') {
                loadProfessores();
            }
        }
    }, [isOpen, initialData, type]);

    const loadProfessores = async () => {
        try {
            const res = await ProfessorService.getAll();
            setProfessores(res.data.content || []);
        } catch (error) {
            console.error("Erro ao carregar professores:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value = e.target.value;

        // Máscara dinâmica de CPF
        if (e.target.name === 'cpf') {
            value = value
                .replace(/\D/g, '') // remove todos os caracteres não numéricos
                .replace(/(\d{3})(\d)/, '$1.$2') // insere ponto após os 3 primeiros
                .replace(/(\d{3})(\d)/, '$1.$2') // insere ponto após os próximos 3
                .replace(/(\d{3})(\d{1,2})/, '$1-$2') // insere hífen após os próximos 3
                .replace(/(-\d{2})\d+?$/, '$1'); // limita ao máximo de 14 caracteres (incluindo pontuação)
        }

        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSelectProfessor = (prof: Professor) => {
        setFormData({ ...formData, professorId: prof.id });
        setIsProfessorListOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Limpa os dados: converte strings vazias em null
        // Isso evita erros no Spring Boot ao tentar parsear datas vazias
        const cleanedData = Object.keys(formData).reduce((acc: any, key) => {
            const value = formData[key];
            acc[key] = value === '' ? null : value;
            return acc;
        }, {});

        try {
            await onSave(cleanedData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProfessores = professores.filter(p =>
        p.nome.toLowerCase().includes(searchProfessor.toLowerCase())
    );

    const selectedProfessor = professores.find(p => p.id === formData.professorId) || initialData?.professor;

    const renderAlunoFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                    <input required name="nome" value={formData.nome || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>

                {/* Campo de Seleção de Professor */}
                <div className="col-span-1 md:col-span-2 relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professor Responsável</label>
                    <div
                        onClick={() => setIsProfessorListOpen(!isProfessorListOpen)}
                        className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 hover:border-cyan-500 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <GraduationCap size={18} className="text-gray-400" />
                            <span className={selectedProfessor ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
                                {selectedProfessor ? selectedProfessor.nome : 'Selecionar um professor...'}
                            </span>
                        </div>
                        <X
                            size={16}
                            className={`text-gray-400 transition-transform ${isProfessorListOpen ? 'rotate-0' : 'rotate-45'}`}
                            onClick={(e) => {
                                if (selectedProfessor) {
                                    e.stopPropagation();
                                    setFormData({ ...formData, professorId: null });
                                }
                            }}
                        />
                    </div>

                    <AnimatePresence>
                        {isProfessorListOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-2 border-b dark:border-gray-600 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50">
                                    <Search size={16} className="text-gray-400" />
                                    <input
                                        autoFocus
                                        placeholder="Pesquisar professor..."
                                        value={searchProfessor}
                                        onChange={(e) => setSearchProfessor(e.target.value)}
                                        className="w-full bg-transparent border-none focus:ring-0 text-sm p-1 dark:text-gray-100"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {filteredProfessores.length > 0 ? (
                                        filteredProfessores.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => handleSelectProfessor(p)}
                                                className="flex items-center justify-between p-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 cursor-pointer transition-colors border-b last:border-none dark:border-gray-700"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{p.nome}</span>
                                                    <span className="text-xs text-gray-500">{p.areaConhecimento}</span>
                                                </div>
                                                {(formData.professorId === p.id || initialData?.professor?.id === p.id) && <Check size={16} className="text-cyan-500" />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-sm text-gray-500 italic">Nenhum professor encontrado.</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp</label>
                    <input required name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</label>
                    <input required name="endereco" value={formData.endereco || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>

                {!isEdit && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                            <input required name="cpf" value={formData.cpf || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RG</label>
                            <input required name="rg" value={formData.rg || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sexo</label>
                            <select name="sexo" value={formData.sexo || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                <option value="">Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Possui Bolsa?</label>
                            <select required name="possuiBolsa" value={formData.possuiBolsa || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Mãe</label>
                            <input name="nomeMae" value={formData.nomeMae || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Pai</label>
                            <input name="nomePai" value={formData.nomePai || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Matrícula</label>
                            <input required type="date" name="dataMatricula" value={formData.dataMatricula || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                    </>
                )}
            </div>
        </>
    );

    const renderProfessorFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome *</label>
                    <input required name="nome" value={formData.nome || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                    <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp *</label>
                    <input required name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Área Conhecimento *</label>
                    <select required name="areaConhecimento" value={formData.areaConhecimento || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <option value="">Selecione...</option>
                        <option value="MATEMATICA">MATEMÁTICA</option>
                        <option value="REDAÇÃO">REDAÇÃO</option>
                        <option value="FÍSICA">FÍSICA</option>
                        <option value="QUÍMICA">QUÍMICA</option>
                        <option value="PORTUGUÊS">PORTUGUÊS</option>
                        <option value="LITERATURA">LITERATURA</option>
                        <option value="HISTÓRIA">HISTÓRIA</option>
                        <option value="GEOGRAFIA">GEOGRAFIA</option>
                        <option value="BIOLOGIA">BIOLOGIA</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Entrada *</label>
                    <input required type="date" name="dataDeEntrada" value={formData.dataDeEntrada || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                    <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                </div>

                {!isEdit && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF *</label>
                            <input required name="cpf" value={formData.cpf || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RG *</label>
                            <input required name="rg" value={formData.rg || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gênero</label>
                            <input name="genero" value={formData.genero || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Nascimento</label>
                            <input type="date" name="dataNascimento" value={formData.dataNascimento || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Saída</label>
                            <input type="date" name="dataDeSaida" value={formData.dataDeSaida || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        </div>

                    </>
                )}
            </div>
        </>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
                    >
                        <div className={`p-6 border-b dark:border-gray-700 flex justify-between items-center text-white ${type === 'aluno' ? 'bg-cyan-600 dark:bg-cyan-700' : 'bg-purple-600 dark:bg-purple-700'}`}>
                            <h2 className="text-2xl font-bold">
                                {isEdit ? 'Editar' : 'Novo'} {type === 'aluno' ? 'Aluno' : 'Professor'}
                            </h2>
                            <button onClick={onClose} className="p-2 cursor-pointer hover:bg-white/20 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                            {type === 'aluno' ? renderAlunoFields() : renderProfessorFields()}

                            <div className="mt-8 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                                <button type="button" onClick={onClose} className="px-6 py-2 cursor-pointer rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={loading} className={`cursor-pointer px-8 py-2 rounded-xl font-bold text-white transition-all shadow-md ${type === 'aluno' ? 'bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600' : 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600'} ${loading ? 'opacity-70 !cursor-not-allowed' : ''}`}>
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
