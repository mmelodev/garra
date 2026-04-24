import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, GraduationCap, User, Phone, Mail, MapPin, Calendar, CreditCard, Droplet, Hash, BookOpen } from 'lucide-react';
import { Aluno, Professor } from '../interfaces';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data: any | null; // Aluno or Professor
    type: 'aluno' | 'professor';
    onEdit: (data: any) => void;
    onFetchMore: (id: number, type: 'aluno' | 'professor') => Promise<any>;
}

export const EntityDetailsModal = ({ isOpen, onClose, data: incomingData, type, onEdit, onFetchMore }: Props) => {
    const [fetchedData, setFetchedData] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFetchedData(null);
            setIsExpanded(false);
        }
    }, [isOpen]);

    if (!incomingData) return null;

    const data = isExpanded && fetchedData ? fetchedData : incomingData;
    const isProf = type === 'professor';

    const formatDate = (dateString?: string) => {
        if (!dateString) return dateString;
        if (dateString.includes('-')) {
            const parts = dateString.split('T')[0].split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        return dateString;
    };

    const renderDetail = (label: string, value: any, Icon: any) => {
        if (value === undefined || value === null || value === '') return null;
        return (
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600/50 transition-colors">
                <div className={`p-2 rounded-xl ${isProf ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">{label}</p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] transition-colors"
                    >
                        {/* Header */}
                        <div className={`relative p-8 text-white ${isProf ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-gradient-to-br from-cyan-600 to-cyan-800'}`}>
                            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer backdrop-blur-md">
                                <X size={20} />
                            </button>
                            
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                                    {isProf ? <GraduationCap size={40} /> : <User size={40} />}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black">{data.nome}</h2>
                                    <p className="text-white/80 font-medium text-sm mt-1 uppercase tracking-widest">
                                        Ficha de {type === 'aluno' ? 'Aluno' : 'Professor'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body */}
                        <div className="p-8 overflow-y-auto flex-1 bg-white dark:bg-gray-800 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderDetail('Email', data.email, Mail)}
                                {renderDetail('WhatsApp', data.whatsapp, Phone)}
                                {renderDetail('CPF', data.cpf, Hash)}
                                {renderDetail('RG', data.rg, CreditCard)}
                                
                                {isProf ? (
                                    <>
                                        {renderDetail('Área de Conhecimento', data.areaConhecimento, BookOpen)}
                                        {renderDetail('Gênero', data.genero, Droplet)}
                                        {renderDetail('Data de Nascimento', formatDate(data.dataNascimento), Calendar)}
                                        {renderDetail('Data de Entrada', formatDate(data.dataDeEntrada), Calendar)}
                                        {renderDetail('Data de Saída', formatDate(data.dataDeSaida), Calendar)}
                                        {data.descricao && (
                                            <div className="col-span-1 md:col-span-2 flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600/50">
                                                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                                    <BookOpen size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">Descrição</p>
                                                    <p className="text-gray-800 dark:text-gray-100 font-medium whitespace-pre-wrap">{data.descricao}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {renderDetail('Endereço', data.endereco, MapPin)}
                                        {renderDetail('Sexo', data.sexo, Droplet)}
                                        {renderDetail('Nome da Mãe', data.nomeMae, User)}
                                        {renderDetail('Nome do Pai', data.nomePai, User)}
                                        {renderDetail('Possui Bolsa', typeof data.possuiBolsa === 'boolean' ? (data.possuiBolsa ? 'Sim' : 'Não') : data.possuiBolsa, CreditCard)}
                                        {renderDetail('Data da Matrícula', formatDate(data.dataMatricula), Calendar)}
                                        
                                        {/* Professor Vinculado */}
                                        {data.professor && (
                                            <div className="col-span-1 md:col-span-2 flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 transition-colors mt-2">
                                                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-800/40 text-indigo-600 dark:text-indigo-400">
                                                    <GraduationCap size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-indigo-400 dark:text-indigo-500 tracking-wider uppercase mb-1">Professor Responsável</p>
                                                    <p className="text-indigo-900 dark:text-indigo-100 font-bold">{data.professor.nome}</p>
                                                    <p className="text-indigo-700/70 dark:text-indigo-300/60 text-xs font-medium uppercase tracking-tight">{data.professor.areaConhecimento}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-wrap items-center justify-start gap-4 transition-colors">
                            <button 
                                onClick={onClose} 
                                className="px-6 py-2.5 cursor-pointer rounded-xl font-bold border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Sair
                            </button>
                            <button 
                                onClick={() => {
                                    onClose();
                                    onEdit(data);
                                }} 
                                className="px-6 py-2.5 cursor-pointer rounded-xl font-bold flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 transition-colors shadow-sm"
                            >
                                <Edit size={18} /> Editar Cadastro
                            </button>
                            <button 
                                onClick={async () => {
                                    if (isExpanded) {
                                        setIsExpanded(false);
                                    } else {
                                        if (!fetchedData) {
                                            setLoading(true);
                                            try {
                                                const res = await onFetchMore(data.id, type);
                                                setFetchedData(res);
                                                setIsExpanded(true);
                                            } finally {
                                                setLoading(false);
                                            }
                                        } else {
                                            setIsExpanded(true);
                                        }
                                    }
                                }} 
                                disabled={loading}
                                className={`px-6 py-2.5 ml-auto cursor-pointer rounded-xl font-bold flex items-center gap-2 text-white transition-colors shadow-sm ${isExpanded ? 'bg-gray-500 hover:bg-gray-600' : 'bg-cyan-600 hover:bg-cyan-700'} ${loading ? 'opacity-70' : ''}`}
                            >
                                <BookOpen size={18} /> {loading ? 'Carregando...' : isExpanded ? 'Minimizar as informações' : 'Visualizar todas as informações'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
